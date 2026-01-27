/**
 * Embedding & pgvector – Was ist das?
 *
 * Embedding:
 * - Ein Embedding ist eine Umwandlung von Text (z.B. ein Satz, ein Dokument) in einen numerischen Vektor (z.B. [0.12, -0.98, ...]).
 * - Ziel: Semantische Bedeutung von Texten als Zahlen abbilden, sodass ähnliche Bedeutungen ähnliche Vektoren haben.
 * - Beispiel: "React ist eine UI-Bibliothek" und "React wird für Benutzeroberflächen genutzt" → ähnliche Embeddings.
 * - Embeddings werden meist von KI-Modellen wie OpenAI erzeugt (z.B. text-embedding-3-small).
 * - Anwendung: Semantische Suche, Clustering, Ähnlichkeitsvergleiche.
 *
 * pgvector:
 * - pgvector ist eine PostgreSQL-Erweiterung, die einen neuen Datentyp "vector" und Funktionen für Vektor-Ähnlichkeitssuche bereitstellt.
 * - Damit kann man Vektoren (z.B. Embeddings) direkt in einer Postgres-Tabelle speichern und sehr effizient nach ähnlichen Vektoren suchen.
 * - Unterstützt verschiedene Distanzmaße (cosine, L2, inner product).
 * - Ermöglicht "Semantic Search" direkt in der Datenbank – ideal für RAG-Systeme.
 * - Mit Indexen (z.B. HNSW) ist auch Suche in großen Datenmengen performant.
 *
 * Im System:
 * - Jeder Knowledge-Artikel bekommt beim Einfügen ein Embedding (generateEmbedding).
 * - Dieses Embedding wird in der Supabase-DB (Postgres mit pgvector) gespeichert.
 * - Bei einer User-Frage wird ebenfalls ein Embedding erzeugt und mit pgvector nach den ähnlichsten Dokumenten gesucht (searchKnowledge).
 * - So findet das System relevante Antworten, auch wenn die Wörter nicht exakt übereinstimmen.
 */

import { embed } from 'ai'
import { embeddingModel } from '../../../lib/openai'
import { supabaseAdmin } from '../../../lib/supabase'
import { APP_CONFIG } from '../../../lib/constants'
import { logger } from '../../../lib/logger'
import type { KnowledgeItem } from '../../../types'

/**
 * Generate embedding vector for a given text using OpenAI
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const { embedding } = await embed({
      model: embeddingModel,
      value: text,
    });

    // Debug: Logge die ersten Werte des Embeddings
    logger.info(
      `Embedding generated for text (length: ${text.length}): [${embedding.slice(0, 5).join(", ")}...]`,
      { module: "VectorService", function: "generateEmbedding" }
    );
    return embedding;
  } catch (error) {
    logger.error('Failed to generate embedding', 
      { module: 'VectorService', function: 'generateEmbedding' },
      error
    );
    throw new Error('Failed to generate embedding');
  }
}

/**
 * Search knowledge base using semantic similarity
 * Performs vector search via Supabase RPC function
 */
export async function searchKnowledge(
  query: string,
  threshold: number = APP_CONFIG.MATCH_THRESHOLD,
  limit: number = APP_CONFIG.MATCH_COUNT
): Promise<KnowledgeItem[]> {
  // Validation
  if (!query || query.trim().length === 0) {
    throw new Error('Search query cannot be empty');
  }
  
  if (!supabaseAdmin) {
    throw new Error('Supabase admin client not initialized');
  }

  try {
    // 1. Generate embedding for the query
    logger.info(
      `Generating embedding for search query: "${query}"`,
      { module: "VectorService", function: "searchKnowledge" }
    );
    const queryEmbedding = await generateEmbedding(query);

    // 2. Call Supabase RPC function for vector similarity search
    logger.info(
      `Calling match_knowledge with threshold=${threshold}, limit=${limit}`,
      { module: "VectorService", function: "searchKnowledge" }
    );
    const { data, error } = await supabaseAdmin.rpc('match_knowledge', {
      query_embedding: `[${queryEmbedding.join(',')}]`,
      match_threshold: threshold,
      match_count: limit,
    });

    if (error) {
      logger.error('Supabase RPC call failed',
        { 
          module: 'VectorService',
          function: 'searchKnowledge',
          metadata: { 
            embeddingLength: queryEmbedding.length,
            threshold,
            limit
          }
        },
        error
      );
      throw error;
    }

    // 3. Transform database results to KnowledgeItem type
    const results = (data || []).map((item: any) => ({
      id: item.id,
      title: item.title,
      content: item.content,
      similarity: item.similarity,
    }));

    logger.info(
      `searchKnowledge: Query="${query}", Results=${results.length}, TopSimilarity=${results[0]?.similarity}`,
      { module: "VectorService", function: "searchKnowledge" }
    );

    // Debug: Logge alle gefundenen Titel und Ähnlichkeiten
    if (results.length > 0) {
      logger.info(
        `Found titles: ${results.map((r: KnowledgeItem) => `${r.title} (sim: ${r.similarity})`).join(" | ")}`,
        { module: "VectorService", function: "searchKnowledge" }
      );
    }

    return results;
  } catch (error) {
    logger.error('Knowledge search failed',
      { module: 'VectorService', function: 'searchKnowledge' },
      error
    );
    throw new Error('Failed to search knowledge base');
  }
}

/**
 * Store document with embedding in knowledge base
 */
export async function storeDocument(
  title: string,
  content: string,
  metadata?: Record<string, unknown>
): Promise<string> {
  // Validation
  if (!title || title.trim().length === 0) {
    throw new Error('Document title cannot be empty')
  }
  
  if (!content || content.trim().length === 0) {
    throw new Error('Document content cannot be empty')
  }
  
  if (!supabaseAdmin) {
    throw new Error('Supabase admin client not initialized')
  }

  try {
    // Generate embedding for content
    const embedding = await generateEmbedding(content)

    // Use raw SQL to ensure proper vector type
    // The supabase-js client sometimes serializes arrays incorrectly
    const { data, error } = await supabaseAdmin.rpc('insert_knowledge', {
      p_title: title,
      p_content: content,
      p_embedding: embedding,
      p_metadata: metadata || {}
    })

    if (error) {
      logger.error('Failed to insert document into database',
        { 
          module: 'VectorService',
          function: 'storeDocument',
          metadata: { title, contentLength: content.length }
        },
        error
      )
      throw error
    }

    logger.info(`Document stored successfully: "${title}"`,
      { module: 'VectorService', function: 'storeDocument' }
    )
    return data
  } catch (error) {
    logger.error('Document storage failed',
      { module: 'VectorService', function: 'storeDocument' },
      error
    )
    throw new Error('Failed to store document')
  }
}
