import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

type ChunkInput = {
  content: string
  chunk_index: number
  total_chunks: number
  make?: string
  model?: string
  source_file: string
}

type IngestRequest = {
  document_id: string
  chunks: ChunkInput[]
}

function corsJson(body: object, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  })
}

// Extracts user id (sub) from the JWT in the Authorization header.
// No Supabase round-trip needed — the JWT payload is self-contained.
function extractUserId(req: Request): string | null {
  const auth = req.headers.get('Authorization') ?? ''
  if (!auth.startsWith('Bearer ')) return null
  try {
    const payload = JSON.parse(atob(auth.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))
    return payload.sub ?? null
  } catch {
    return null
  }
}

// Sends up to 20 texts in a single OpenAI embeddings call (20x faster than 1-by-1).
async function embedBatch(openai: OpenAI, texts: string[]): Promise<number[][]> {
  const res = await openai.embeddings.create({ model: 'text-embedding-3-small', input: texts })
  return res.data.map(d => d.embedding)
}

// deno-lint-ignore no-explicit-any
async function insertChunks(supabase: any, userId: string, documentId: string, chunks: ChunkInput[], embeddings: number[][]): Promise<void> {
  const rows = chunks.map((c, i) => ({
    user_id:     userId,
    document_id: documentId,
    content:     c.content,
    embedding:   `[${embeddings[i]!.join(',')}]`,
    metadata: {
      make:         c.make ?? null,
      model:        c.model ?? null,
      source_file:  c.source_file,
      chunk_index:  c.chunk_index,
      total_chunks: c.total_chunks,
    },
  }))
  const { error } = await supabase.from('user_manual_chunks').insert(rows)
  if (error) throw new Error(`DB insert failed: ${error.message}`)
}

async function handleRequest(req: Request): Promise<Response> {
  const userId = extractUserId(req)
  if (!userId) return corsJson({ error: 'Unauthorized' }, 401)

  const body: IngestRequest = await req.json()
  if (!body.document_id || !body.chunks?.length) {
    return corsJson({ error: 'document_id and chunks are required' }, 400)
  }

  const openai = new OpenAI({ apiKey: Deno.env.get('OPENAI_API_KEY') })
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  )

  const BATCH = 20
  for (let i = 0; i < body.chunks.length; i += BATCH) {
    const batch = body.chunks.slice(i, i + BATCH)
    const embeddings = await embedBatch(openai, batch.map(c => c.content))
    await insertChunks(supabase, userId, body.document_id, batch, embeddings)
  }

  await supabase.rpc('update_document_status', {
    p_document_id: body.document_id,
    p_status:      'ready',
    p_chunk_count: body.chunks.length,
  })

  return corsJson({ ok: true, chunks_stored: body.chunks.length })
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })
  try {
    return await handleRequest(req)
  } catch (err) {
    console.error('ingest-user-manual error:', err)
    return corsJson({ error: err instanceof Error ? err.message : 'Internal error' }, 500)
  }
})
