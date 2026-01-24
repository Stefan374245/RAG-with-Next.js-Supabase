export const APP_CONFIG = {
  // Supabase Configuration
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  
  // RAG Configuration
  MATCH_THRESHOLD: 0.7, // Minimum similarity score for retrieval
  MATCH_COUNT: 5, // Number of documents to retrieve
  CHUNK_SIZE: 512, // Token size for document chunks
  CHUNK_OVERLAP: 50, // Overlap between chunks
  
  // Rate Limiting
  THROTTLE_DELAY: 3000, // 3 seconds between requests
  
  // UI Configuration
  MAX_MESSAGE_LENGTH: 500,
} as const
