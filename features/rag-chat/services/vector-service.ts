import { embed } from 'ai'
import { embeddingModel } from '../../../lib/openai'
import { supabaseAdmin } from '../../../lib/supabase'
import { APP_CONFIG } from '../../../lib/constants'
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
    
    return embedding
  } catch (error) {
    console.error('Error generating embedding:', error)
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
  if (!supabaseAdmin) {
    throw new Error('Supabase admin client not initialized')
  }

  try {
    // 1. Generate embedding for the query
    const queryEmbedding = await generateEmbedding(query)

    // 2. Call Supabase RPC function for vector similarity search
    const { data, error } = await supabaseAdmin.rpc('match_knowledge', {
      query_embedding: queryEmbedding,
      match_threshold: threshold,
      match_count: limit,
    })

    if (error) {
      console.error('Supabase RPC error:', error)
      throw error
    }

    // 3. Transform database results to KnowledgeItem type
    return (data || []).map((item: any) => ({
      id: item.id,
      title: item.title,
      content: item.content,
      similarity: item.similarity,
    }))
  } catch (error) {
    console.error('Error searching knowledge:', error)
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
  if (!supabaseAdmin) {
    throw new Error('Supabase admin client not initialized')
  }

  try {
    // Generate embedding for content
    const embedding = await generateEmbedding(content)

    // Insert into database
    const { data, error } = await supabaseAdmin
      .from('knowledge_base')
      .insert({
        title,
        content,
        embedding,
        metadata: metadata || {},
      })
      .select('id')
      .single()

    if (error) {
      console.error('Supabase insert error:', error)
      throw error
    }

    return data.id
  } catch (error) {
    console.error('Error storing document:', error)
    throw new Error('Failed to store document')
  }
}
