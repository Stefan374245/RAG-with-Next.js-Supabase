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
    })
    
    logger.embeddingGenerated(embedding.length, text.length)
    return embedding
  } catch (error) {
    logger.error('Failed to generate embedding', 
      { module: 'VectorService', function: 'generateEmbedding' },
      error
    )
    throw new Error('Failed to generate embedding')
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
    throw new Error('Search query cannot be empty')
  }
  
  if (!supabaseAdmin) {
    throw new Error('Supabase admin client not initialized')
  }

  try {
    // 1. Generate embedding for the query
    const queryEmbedding = await generateEmbedding(query)

    // 2. Call Supabase RPC function for vector similarity search
    // Send as string format to match how PostgreSQL stores vectors
    const { data, error } = await supabaseAdmin.rpc('match_knowledge', {
      query_embedding: `[${queryEmbedding.join(',')}]`,
      match_threshold: threshold,
      match_count: limit,
    })

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
      )
      throw error
    }

    // 3. Transform database results to KnowledgeItem type
    const results = (data || []).map((item: any) => ({
      id: item.id,
      title: item.title,
      content: item.content,
      similarity: item.similarity,
    }))
    
    logger.ragRetrieval(
      results.length,
      results[0]?.similarity,
      threshold
    )
    
    return results
  } catch (error) {
    logger.error('Knowledge search failed',
      { module: 'VectorService', function: 'searchKnowledge' },
      error
    )
    throw new Error('Failed to search knowledge base')
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
