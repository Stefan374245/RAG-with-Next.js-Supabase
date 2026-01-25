import { searchKnowledge } from '../../../features/rag-chat/services/vector-service'
import { buildRAGPrompt } from '../../../features/rag-chat/services/llm-service'

export const runtime = 'edge'

/**
 * Debug endpoint - see exactly what the LLM receives
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const query = searchParams.get('q') || 'Angular'

  try {
    // Step 1: Search
    const sources = await searchKnowledge(query, 0.3, 5)
    
    // Step 2: Build prompt
    const systemPrompt = buildRAGPrompt(query, sources)

    return Response.json({
      query,
      sourcesFound: sources.length,
      sources: sources.map(s => ({
        title: s.title,
        similarity: `${((s.similarity ?? 0) * 100).toFixed(1)}%`
      })),
      systemPromptPreview: systemPrompt.substring(0, 500) + '...',
      systemPromptLength: systemPrompt.length,
      diagnosis: sources.length > 0 
        ? '✅ Sources found - LLM should use them'
        : '⚠️ No sources - LLM will give generic answer'
    })
  } catch (error) {
    return Response.json({
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
