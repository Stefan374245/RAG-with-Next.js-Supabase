import { config } from 'dotenv'
import { resolve } from 'path'
import { createClient } from '@supabase/supabase-js'

config({ path: resolve(process.cwd(), '.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function getEmbedding(text: string): Promise<number[]> {
  const { embed } = await import('ai')
  const { openai } = await import('@ai-sdk/openai')
  const { embedding } = await embed({ model: openai.embedding('text-embedding-3-small'), value: text })
  return embedding
}

async function search(question: string, make: string, model: string, threshold: number) {
  console.log(`\n🔍 Query: "${question}" | threshold: ${threshold}`)
  const embedding = await getEmbedding(question)
  const { data, error } = await supabase.rpc('match_rescue_chunks', {
    query_embedding: `[${embedding.join(',')}]`,
    bike_make: make,
    bike_model: model,
    match_threshold: threshold,
    match_count: 5,
  })
  if (error) { console.error('Error:', error); return }
  console.log(`📊 Treffer: ${data?.length ?? 0}`)
  data?.forEach((c: any, i: number) => {
    console.log(`\n[${i}] similarity: ${c.similarity?.toFixed(4)} | chunk: ${c.metadata?.chunk_index}`)
    console.log(c.content.substring(0, 200))
  })
}

async function main() {
  await search('Wasserpumpe wechseln', 'KTM', '890 Adventure', 0.4)
  await search('Wasserpumpe wechseln', 'KTM', '890 Adventure', 0.2)
  await search('water pump repair coolant', 'KTM', '890 Adventure', 0.4)
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1) })
