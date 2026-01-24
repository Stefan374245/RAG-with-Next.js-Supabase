'use server'

import { storeDocument } from '../../features/rag-chat/services/vector-service'

const SEED_DOCUMENTS = [
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
    title: 'Next.js App Router',
    content: 'The App Router uses React Server Components by default. It supports nested layouts, loading states, and error boundaries. File-system based routing with app directory structure.',
    metadata: { category: 'nextjs', source: 'docs' }
  },
  {
    title: 'Vercel AI SDK streamText',
    content: 'The streamText function provides streaming text generation with any LLM provider. It handles SSE (Server-Sent Events) formatting automatically. Returns a readable stream that can be piped to the response.',
    metadata: { category: 'ai-sdk', source: 'docs' }
  },
  {
    title: 'pgvector Extension',
    content: 'pgvector adds vector similarity search to PostgreSQL. Supports multiple distance metrics including cosine, L2, and inner product. HNSW index provides fast approximate nearest neighbor search for large datasets.',
    metadata: { category: 'rag', source: 'theory' }
  },
]

export async function seedKnowledgeBase() {
  try {
    let successCount = 0
    const errors: string[] = []

    for (const doc of SEED_DOCUMENTS) {
      try {
        await storeDocument(doc.title, doc.content, doc.metadata)
        successCount++
      } catch (error) {
        errors.push(`${doc.title}: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }

    return {
      success: true,
      message: `Seeding completed!\n✅ Success: ${successCount}/${SEED_DOCUMENTS.length}\n${errors.length > 0 ? `\n❌ Errors:\n${errors.join('\n')}` : ''}`,
    }
  } catch (error) {
    return {
      success: false,
      message: `Fatal error: ${error instanceof Error ? error.message : 'Unknown error'}`,
    }
  }
}
