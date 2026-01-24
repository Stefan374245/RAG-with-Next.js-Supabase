// Global Type Definitions for RAG Challenge

export interface KnowledgeItem {
  id: string
  title: string
  content: string
  similarity: number
  metadata?: Record<string, unknown>
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  sources?: KnowledgeItem[]
  timestamp: Date
}

export interface RAGResponse {
  answer: string
  sources: KnowledgeItem[]
}

export interface EmbeddingResponse {
  embedding: number[]
}
