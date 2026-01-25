import { supabaseAdmin } from '../../../lib/supabase'

export const runtime = 'edge'

/**
 * Database health check endpoint
 */
export async function GET(req: Request) {
  if (!supabaseAdmin) {
    return Response.json({
      error: 'Supabase admin not configured',
      message: 'SUPABASE_SERVICE_ROLE_KEY missing'
    }, { status: 500 })
  }

  try {
    // 1. Check table exists and count documents
    const { count, error: countError } = await supabaseAdmin
      .from('knowledge_base')
      .select('*', { count: 'exact', head: true })

    if (countError) {
      return Response.json({
        error: 'Database query failed',
        message: countError.message,
        hint: 'Table might not exist. Run migrations.'
      }, { status: 500 })
    }

    // 2. Get a sample document with embedding
    const { data: sampleDoc, error: sampleError } = await supabaseAdmin
      .from('knowledge_base')
      .select('id, title, embedding')
      .limit(1)
      .single()

    if (sampleError) {
      return Response.json({
        documentsInDB: count,
        error: 'Could not fetch sample document',
        message: sampleError.message
      }, { status: 500 })
    }

    // 3. Check embedding dimensions
    const embeddingLength = sampleDoc.embedding?.length || 0

    // 4. Test RPC function exists
    const testEmbedding = new Array(1536).fill(0) // dummy embedding
    const { data: rpcTest, error: rpcError } = await supabaseAdmin
      .rpc('match_knowledge', {
        query_embedding: testEmbedding,
        match_threshold: 0.5,
        match_count: 1
      })

    return Response.json({
      status: '✅ Database healthy',
      documentsInDB: count,
      sampleDocument: {
        id: sampleDoc.id,
        title: sampleDoc.title,
        embeddingDimensions: embeddingLength,
        embeddingType: typeof sampleDoc.embedding
      },
      rpcFunctionTest: {
        exists: !rpcError,
        error: rpcError?.message,
        resultCount: rpcTest?.length || 0
      },
      diagnosis: !rpcError && embeddingLength === 1536 && (count ?? 0) > 0
        ? '✅ Everything looks good! RAG should work.'
        : '⚠️  Issues detected. See details above.'
    })

  } catch (error) {
    return Response.json({
      error: 'Health check failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
