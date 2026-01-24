import { openai } from '@ai-sdk/openai'

// OpenAI Embedding Model
export const embeddingModel = openai.embedding('text-embedding-3-small')

// OpenAI Chat Model for RAG
export const chatModel = openai('gpt-4-turbo')
