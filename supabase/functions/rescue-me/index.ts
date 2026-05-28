import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

type Chunk = { content: string; metadata: { make?: string; model?: string } }
type StreamChunk = OpenAI.Chat.Completions.ChatCompletionChunk

// Extracts user id (sub) from JWT — returns null for unauthenticated / anon requests.
function extractUserId(req: Request): string | null {
  const auth = req.headers.get('Authorization') ?? ''
  if (!auth.startsWith('Bearer ')) return null
  try {
    const payload = JSON.parse(atob(auth.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))
    // Supabase anon key also has a JWT — filter it out by checking the role claim
    if (payload.role === 'anon') return null
    return payload.sub ?? null
  } catch {
    return null
  }
}

function corsJson(body: object, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { ...CORS, 'Content-Type': 'application/json' } })
}

async function buildEmbedding(openai: OpenAI, text: string): Promise<number[]> {
  const res = await openai.embeddings.create({ model: 'text-embedding-3-small', input: text })
  return res.data[0].embedding
}

// Workshop manuals are in English — translate the query first so the
// embedding matches the manual content regardless of the rider's language.
async function translateToEnglish(openai: OpenAI, text: string): Promise<string> {
  const res = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'You are a translator. Translate the motorcycle repair question to English. Return only the translated text, nothing else.' },
      { role: 'user', content: text },
    ],
    max_tokens: 200,
  })
  return res.choices[0]?.message?.content?.trim() ?? text
}

// deno-lint-ignore no-explicit-any
async function searchPublicChunks(supabase: any, embedding: number[], make?: string, model?: string): Promise<Chunk[]> {
  const { data, error } = await supabase.rpc('match_rescue_chunks', {
    query_embedding: `[${embedding.join(',')}]`,
    bike_make: make ?? null,
    bike_model: model ?? null,
    match_threshold: 0.25,
    match_count: 8,
  })
  if (error) throw error
  return data ?? []
}

// deno-lint-ignore no-explicit-any
async function searchUserChunks(supabase: any, userId: string, embedding: number[], make?: string, model?: string): Promise<Chunk[]> {
  const { data, error } = await supabase.rpc('match_user_chunks', {
    p_user_id:       userId,
    query_embedding: `[${embedding.join(',')}]`,
    bike_make:       make ?? null,
    bike_model:      model ?? null,
    match_threshold: 0.25,
    match_count:     6,
  })
  if (error) throw error
  return data ?? []
}

function buildContext(chunks: Chunk[]): string {
  return chunks
    .map(c => `[${c.metadata?.make ?? ''} ${c.metadata?.model ?? ''}]\n${c.content}`)
    .join('\n\n---\n\n')
}

function buildMessages(question: string, context: string, make?: string, model?: string) {
  const bikeInfo = [make, model].filter(Boolean).join(' ')
  const system = [
    'You are Rescue Me — an emergency motorcycle workshop assistant by Stefan Helldobler (Moto Nomad).',
    'Stefan is a master mechanic, safety trainer, and enduro guide with 20 years of experience.',
    '',
    'Your knowledge base contains verified technical specs from workshop manuals: torque values, oil capacities, tyre pressures, service intervals, part numbers.',
    '',
    'HOW TO ANSWER:',
    '1. Start with the key spec value from the provided context (e.g. "Oil capacity: 2.8 L with filter").',
    '2. Then give a practical step-by-step procedure in your own words — written like an experienced mechanic explaining it roadside.',
    '3. If multiple relevant specs exist in the context, list them all before the procedure.',
    '4. Use numbered steps for procedures. Keep it direct and clear.',
    '5. End with a short safety note if relevant.',
    '',
    'STRICT RULES:',
    '- Spec values: ONLY use numbers from the provided context. Never guess or invent values.',
    '- Procedure text: Write in your own words from general mechanical knowledge. Never copy manual phrasing.',
    '- If a spec is not in the context, say so clearly, then still help with general procedure knowledge.',
    '- Always respond in the same language the rider used.',
    bikeInfo ? `Bike: ${bikeInfo}` : '',
  ].filter(Boolean).join('\n')
  const user = context.length > 0
    ? `Verified specs from workshop manual:\n${context}\n\n---\nRider question: ${question}`
    : `${question}\n\n(No specific specs found for this bike in the database. Answer from general motorcycle knowledge, and clearly state that no verified spec was found.)`
  return { system, user }
}

async function createCompletion(openai: OpenAI, system: string, user: string) {
  return openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
    max_tokens: 1500,
    stream: true as const,
  })
}

function buildSSEStream(completion: AsyncIterable<StreamChunk>): ReadableStream {
  const encoder = new TextEncoder()
  return new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of completion) {
          const text = chunk.choices[0]?.delta?.content ?? ''
          if (text) controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`))
        }
        controller.enqueue(encoder.encode('data: [DONE]\n\n'))
      } catch (err) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: 'Stream interrupted' })}\n\n`))
      } finally {
        controller.close()
      }
    },
  })
}

async function handleRequest(req: Request): Promise<Response> {
  const { question, make, model } = await req.json()
  if (!question?.trim()) return corsJson({ error: 'question required' }, 400)

  const userId   = extractUserId(req)
  const openai   = new OpenAI({ apiKey: Deno.env.get('OPENAI_API_KEY') })
  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)

  const queryForEmbedding = await translateToEnglish(openai, question)
  const embedding         = await buildEmbedding(openai, queryForEmbedding)

  // Run both searches in parallel — user chunks get priority in the context window
  const [publicChunks, userChunks] = await Promise.all([
    searchPublicChunks(supabase, embedding, make, model),
    userId ? searchUserChunks(supabase, userId, embedding, make, model) : Promise.resolve([]),
  ])
  const allChunks = [...userChunks, ...publicChunks].slice(0, 10)

  const { system, user } = buildMessages(question, buildContext(allChunks), make, model)
  const completion = await createCompletion(openai, system, user)
  return new Response(buildSSEStream(completion), {
    headers: { ...CORS, 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', 'Connection': 'keep-alive' },
  })
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })
  try {
    return await handleRequest(req)
  } catch (err) {
    console.error('rescue-me error:', err)
    return corsJson({ error: err instanceof Error ? err.message : 'Internal error' }, 500)
  }
})
