/**
 * Shared TypeScript Type Definitions
 */

/**
 * Knowledge base item retrieved from database
 */
export interface KnowledgeItem {
  id: string
  title: string
  content: string
  embedding?: number[]
  metadata?: Record<string, unknown>
  similarity?: number
  created_at?: string
}

/**
 * Chat message from Vercel AI SDK
 */
export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  createdAt?: Date
}

/**
 * Source document referenced in RAG response
 */
export interface SourceDocument {
  title: string
  content: string
  similarity: number
  metadata?: Record<string, unknown>
}

/**
 * RAG Query Result
 */
export interface RAGQueryResult {
  answer: string
  sources: SourceDocument[]
  query: string
  timestamp: string
}
