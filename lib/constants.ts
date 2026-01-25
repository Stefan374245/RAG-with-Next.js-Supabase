/**
 * Application Configuration Constants
 * Central configuration for the RAG system
 */

export const APP_CONFIG = {
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  
    MATCH_THRESHOLD: 0.3, 
  MATCH_COUNT: 5,
  CHUNK_SIZE: 512,
  CHUNK_OVERLAP: 50,
  EMBEDDING_DIMENSION: 1536,
  
  // LLM Configuration
  TEMPERATURE: 0.3,
  MAX_TOKENS: 1000,
  
  // Rate Limiting
  THROTTLE_DELAY: 3000, 
  
  // UI Configuration
  MAX_MESSAGE_LENGTH: 500,
  
  // Debug
  DEBUG_MODE: process.env.NODE_ENV !== 'production',
} as const

/**
 * Validation: Ensure required environment variables are set
 */
export function validateConfig(): void {
  const required = ['NEXT_PUBLIC_SUPABASE_URL', 'OPENAI_API_KEY']
  const missing = required.filter(key => !process.env[key])
  
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    )
  }
}
