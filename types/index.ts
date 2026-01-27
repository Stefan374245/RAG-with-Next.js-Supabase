/**
 * Shared TypeScript Type Definitions
 * Central type definitions for the RAG system
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
 * Similar to KnowledgeItem but with required similarity
 */
export interface SourceDocument {
  title: string
  content: string
  similarity: number
  metadata?: Record<string, unknown>
}

/**
 * RAG Query Result
 * Complete response from a RAG query including answer and sources
 */
export interface RAGQueryResult {
  answer: string
  sources: SourceDocument[]
  query: string
  timestamp: string
}

/**
 * RAG Configuration
 */
export interface RAGConfig {
  matchThreshold: number
  matchCount: number
  chunkSize: number
  chunkOverlap: number
  embeddingDimension: number
}

/**
 * API Response wrapper
 */
export interface APIResponse<T = unknown> {
  success: boolean
  data?: T
  error?: {
    message: string
    code?: string
    details?: unknown
  }
}

