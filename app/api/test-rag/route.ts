import { searchKnowledge } from '../../../features/rag-chat/services/vector-service'
import { generateEmbedding } from '../../../features/rag-chat/services/vector-service'
import { supabaseAdmin } from '../../../lib/supabase'

export const runtime = 'edge'

/**
 * Test endpoint to verify RAG is working
 * Usage: GET /api/test-rag?q=your query
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const query = searchParams.get('q') || 'JavaScript closures'

  try {
    // Step 1: Generate embedding
    const embedding = await generateEmbedding(query)
    
    // Step 2: Try direct RPC call with very low threshold
    const { data: rpcData, error: rpcError } = await supabaseAdmin!.rpc('match_knowledge', {
      query_embedding: `[${embedding.join(',')}]`,
      match_threshold: 0.0, // Accept ANY match
      match_count: 10
    })

    // Step 3: Also try with our searchKnowledge function
    const sources = await searchKnowledge(query, 0.0, 10)

    return Response.json({
      query,
      embeddingLength: embedding.length,
      embeddingPreview: embedding.slice(0, 5),
      directRPC: {
        error: rpcError?.message,
        resultCount: rpcData?.length || 0,
        results: rpcData?.slice(0, 3).map((r: any) => ({
          title: r.title,
          similarity: r.similarity
        }))
      },
      viaSearchFunction: {
        resultCount: sources.length,
        results: sources.slice(0, 3).map(s => ({
          title: s.title,
          similarity: s.similarity
        }))
      },
      diagnosis: rpcData?.length > 0 
        ? '✅ RPC works! Problem is in searchKnowledge or threshold'
        : '❌ RPC returns nothing. Problem in database or RPC function'
    })
  } catch (error) {
    return Response.json({
      error: 'Test failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      query
    }, { status: 500 })
  }
}
