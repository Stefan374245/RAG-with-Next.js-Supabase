import { streamText } from 'ai'
import { chatModel } from '../../../lib/openai'
import { searchKnowledge } from '../../../features/rag-chat/services/vector-service'
import { buildRAGPrompt } from '../../../features/rag-chat/services/llm-service'

export const runtime = 'edge'

/**
 * Chat API Route with RAG Pipeline
 * 
 * Workflow:
 * 1. Receive user message
 * 2. Perform semantic search to retrieve relevant documents
 * 3. Build augmented prompt with retrieved context
 * 4. Stream LLM response using Vercel AI SDK
 */
export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    if (!messages || messages.length === 0) {
      return new Response('Missing messages', { status: 400 })
    }

    // Get the latest user message
    const userMessage = messages[messages.length - 1]?.content || ''

    if (!userMessage) {
      return new Response('Empty message', { status: 400 })
    }

    // Step 1: Retrieval - Semantic search for relevant knowledge
    const sources = await searchKnowledge(userMessage)

    // Step 2: Augmentation - Build prompt with retrieved context
    const systemPrompt = buildRAGPrompt(userMessage, sources)

    // Step 3: Generation - Stream LLM response
    const result = await streamText({
      model: chatModel,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userMessage,
        },
      ],
      temperature: 0.7,
      maxTokens: 1000,
    })

    // Return streaming response
    // The Vercel AI SDK automatically handles SSE formatting
    return result.toDataStreamResponse()
  } catch (error) {
    console.error('Chat API error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}
