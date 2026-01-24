/**
 * Knowledge Base Seeding Script
 * Generates real OpenAI embeddings and stores documents in Supabase
 * 
 * Usage: npm run seed
 */

import { config } from 'dotenv'
import { resolve } from 'path'

// Load .env.local file
config({ path: resolve(process.cwd(), '.env.local') })

import { storeDocument } from '../features/rag-chat/services/vector-service'

// Demo documents for RAG Challenge
const SEED_DOCUMENTS = [
  // React Documentation
  {
    title: 'React Server Components',
    content: 'React Server Components allow you to write components that render on the server. They reduce the JavaScript bundle sent to the client and improve performance. Server Components can directly access backend resources like databases.',
    metadata: { category: 'react', source: 'docs' }
  },
  {
    title: 'React 19 useActionState Hook',
    content: 'The useActionState hook manages form submission states. It provides pending state, form data handling, and optimistic updates out of the box. It replaces the need for manual loading state management.',
    metadata: { category: 'react', source: 'docs' }
  },
  {
    title: 'React Compiler',
    content: 'The React Compiler automatically memoizes components and hooks, eliminating the need for manual memo, useMemo, and useCallback. It analyzes your code at build time and optimizes re-renders.',
    metadata: { category: 'react', source: 'docs' }
  },

  // Next.js Documentation
  {
    title: 'Next.js App Router',
    content: 'The App Router uses React Server Components by default. It supports nested layouts, loading states, and error boundaries. File-system based routing with app directory structure.',
    metadata: { category: 'nextjs', source: 'docs' }
  },
  {
    title: 'Next.js API Routes',
    content: 'API Routes provide a solution to build your API with Next.js. Any file inside app/api folder is mapped to /api/* and treated as an API endpoint. They support streaming responses and edge runtime.',
    metadata: { category: 'nextjs', source: 'docs' }
  },
  {
    title: 'Next.js Server Actions',
    content: 'Server Actions are asynchronous server functions that can be called from Client or Server Components. They provide type-safe API calls without manual fetch logic. Defined with use server directive.',
    metadata: { category: 'nextjs', source: 'docs' }
  },
  {
    title: 'Next.js Streaming',
    content: 'Next.js supports streaming responses for better perceived performance. You can stream React components or API responses. Use Suspense boundaries and streaming-compatible data fetching.',
    metadata: { category: 'nextjs', source: 'docs' }
  },

  // RAG Concepts
  {
    title: 'RAG Overview',
    content: 'Retrieval-Augmented Generation combines information retrieval with language generation. It retrieves relevant documents from a knowledge base and uses them to generate informed responses. Improves accuracy over pure LLM generation.',
    metadata: { category: 'rag', source: 'theory' }
  },
  {
    title: 'Vector Embeddings',
    content: 'Vector embeddings convert text into numerical vectors that capture semantic meaning. Similar concepts have similar vectors. Used for semantic search by comparing vector similarity using cosine distance or dot product.',
    metadata: { category: 'rag', source: 'theory' }
  },
  {
    title: 'pgvector Extension',
    content: 'pgvector adds vector similarity search to PostgreSQL. Supports multiple distance metrics including cosine, L2, and inner product. HNSW index provides fast approximate nearest neighbor search for large datasets.',
    metadata: { category: 'rag', source: 'theory' }
  },
  {
    title: 'Semantic Chunking',
    content: 'Semantic chunking splits documents into meaningful segments. Chunk size affects retrieval quality and context window usage. Common strategies: fixed-size with overlap, sentence-based, or paragraph-based splitting.',
    metadata: { category: 'rag', source: 'theory' }
  },

  // Vercel AI SDK Documentation
  {
    title: 'Vercel AI SDK streamText',
    content: 'The streamText function provides streaming text generation with any LLM provider. It handles SSE (Server-Sent Events) formatting automatically. Returns a readable stream that can be piped to the response.',
    metadata: { category: 'ai-sdk', source: 'docs' }
  },
  {
    title: 'Vercel AI SDK useChat Hook',
    content: 'The useChat hook provides React integration for chat interfaces. Handles message state, streaming updates, and error handling. Automatically manages optimistic updates and loading states.',
    metadata: { category: 'ai-sdk', source: 'docs' }
  },

  // Supabase Documentation
  {
    title: 'Supabase Client',
    content: 'Supabase provides a JavaScript client for interacting with Postgres. Supports realtime subscriptions, authentication, and storage. Use createClient with project URL and anon key for browser, service role key for server.',
    metadata: { category: 'supabase', source: 'docs' }
  },
  {
    title: 'Supabase RPC Functions',
    content: 'RPC (Remote Procedure Call) functions allow you to call PostgreSQL functions from the client. Useful for complex queries and vector similarity search. Defined in SQL and called via supabase.rpc() method.',
    metadata: { category: 'supabase', source: 'docs' }
  },
]

async function seedKnowledgeBase() {
  console.log('🌱 Starting knowledge base seeding...\n')

  let successCount = 0
  let errorCount = 0

  for (let i = 0; i < SEED_DOCUMENTS.length; i++) {
    const doc = SEED_DOCUMENTS[i]!
    const progress = `[${i + 1}/${SEED_DOCUMENTS.length}]`

    try {
      console.log(`${progress} Processing: ${doc.title}`)
      console.log(`   Category: ${doc.metadata.category}`)
      console.log(`   Generating embedding...`)

      const id = await storeDocument(doc.title, doc.content, doc.metadata)

      console.log(`   ✅ Stored with ID: ${id}\n`)
      successCount++

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500))
    } catch (error) {
      console.error(`   ❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}\n`)
      errorCount++
    }
  }

  console.log('\n' + '='.repeat(50))
  console.log('📊 Seeding Summary:')
  console.log(`   ✅ Success: ${successCount}`)
  console.log(`   ❌ Failed: ${errorCount}`)
  console.log(`   📦 Total: ${SEED_DOCUMENTS.length}`)
  console.log('='.repeat(50) + '\n')

  if (successCount > 0) {
    console.log('🎉 Knowledge base seeding completed!')
    console.log('💡 You can now start the app with: npm run dev\n')
  } else {
    console.error('❌ All documents failed to seed. Check your environment variables.')
    process.exit(1)
  }
}

// Run the seeding
seedKnowledgeBase()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
