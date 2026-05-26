import { config } from 'dotenv'
import { resolve, basename, dirname } from 'path'
import { readdirSync, statSync, readFileSync } from 'fs'
import { createClient } from '@supabase/supabase-js'

config({ path: resolve(process.cwd(), '.env.local') })

const required = ['NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'OPENAI_API_KEY']
for (const key of required) {
  if (!process.env[key]) {
    console.error(`❌ Missing environment variable: ${key}`)
    process.exit(1)
  }
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface FactEntry {
  fact: string
  category: string
}

async function generateEmbedding(text: string): Promise<number[]> {
  const { embed } = await import('ai')
  const { openai } = await import('@ai-sdk/openai')
  const { embedding } = await embed({
    model: openai.embedding('text-embedding-3-small'),
    value: text,
  })
  return embedding
}

async function storeFact(content: string, metadata: object): Promise<void> {
  const embedding = await generateEmbedding(content)
  const { error } = await supabase.rpc('insert_rescue_chunk', {
    p_content:   content,
    p_embedding: `[${embedding.join(',')}]`,
    p_metadata:  metadata,
  })
  if (error) throw error
}

function toDisplayName(slug: string): string {
  return slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
}

function toDisplayMake(slug: string): string {
  const overrides: Record<string, string> = {
    ktm: 'KTM',
    bmw: 'BMW',
    husqvarna: 'Husqvarna',
    honda: 'Honda',
    yamaha: 'Yamaha',
    triumph: 'Triumph',
    ducati: 'Ducati',
    suzuki: 'Suzuki',
    kawasaki: 'Kawasaki',
  }
  return overrides[slug.toLowerCase()] ?? toDisplayName(slug)
}

function findJsonFiles(dir: string): string[] {
  const results: string[] = []
  for (const entry of readdirSync(dir)) {
    const full = resolve(dir, entry)
    if (statSync(full).isDirectory()) {
      results.push(...findJsonFiles(full))
    } else if (entry.toLowerCase().endsWith('.json')) {
      results.push(full)
    }
  }
  return results
}

function extractMakeModel(filePath: string): { make: string; model: string } {
  const normalized = filePath.replace(/\\/g, '/')
  const factsIdx = normalized.indexOf('/facts/')
  const relativePath = normalized.slice(factsIdx + '/facts/'.length)
  const parts = relativePath.split('/')
  const makeSlug  = parts[0] ?? 'unknown'
  const modelSlug = (parts[1] ?? 'unknown').replace(/\.json$/, '')
  return {
    make:  toDisplayMake(makeSlug),
    model: toDisplayName(modelSlug),
  }
}

async function seedFacts() {
  const factsDir = resolve(process.cwd(), 'data', 'facts')

  console.log('🏍️  Rescue Me — Facts Seeding')
  console.log(`📂 Scanning: ${factsDir}\n`)

  let jsonFiles: string[]
  try {
    jsonFiles = findJsonFiles(factsDir)
  } catch {
    console.error(`❌ Facts directory not found: ${factsDir}`)
    console.error('   Create it with: mkdir -p data/facts/{make}/{model}.json')
    process.exit(1)
  }

  if (jsonFiles.length === 0) {
    console.log('⚠️  No JSON files found in data/facts/')
    process.exit(0)
  }

  console.log(`📄 Found ${jsonFiles.length} fact file(s):`)
  jsonFiles.forEach(f => console.log(`   • ${f}`))
  console.log()

  let totalFacts  = 0
  let successCount = 0
  let errorCount   = 0

  for (const filePath of jsonFiles) {
    const { make, model } = extractMakeModel(filePath)
    console.log(`\n🔧 ${make} ${model}`)

    let facts: FactEntry[]
    try {
      facts = JSON.parse(readFileSync(filePath, 'utf-8')) as FactEntry[]
      console.log(`   📦 ${facts.length} facts`)
    } catch (err) {
      console.error(`   ❌ JSON parse failed: ${err}`)
      errorCount++
      continue
    }

    totalFacts += facts.length

    for (let i = 0; i < facts.length; i++) {
      const entry = facts[i]!
      if (!entry.fact?.trim()) continue

      const metadata = {
        make,
        model,
        category:  entry.category,
        data_type: 'fact',
        source:    'stefan_curated',
      }

      try {
        process.stdout.write(`   [${String(i + 1).padStart(3)}/${facts.length}] "${entry.fact.slice(0, 45)}..." `)
        await storeFact(entry.fact, metadata)
        process.stdout.write('✅\n')
        successCount++
        await new Promise(r => setTimeout(r, 200))
      } catch (err) {
        process.stdout.write(`❌ ${err}\n`)
        errorCount++
      }
    }
  }

  console.log('\n' + '='.repeat(52))
  console.log('📊 Facts Seeding Complete')
  console.log(`   ✅ Facts stored  : ${successCount}`)
  console.log(`   ❌ Failed        : ${errorCount}`)
  console.log(`   📦 Total facts   : ${totalFacts}`)
  console.log(`   📄 Files processed: ${jsonFiles.length}`)
  console.log('='.repeat(52))

  if (successCount === 0) {
    console.error('\n❌ Nothing stored — check API keys and Supabase schema.')
    process.exit(1)
  }

  console.log('\n✅ Facts loaded. Next step:')
  console.log('   Run this SQL to remove old copyrighted chunks:')
  console.log("   DELETE FROM rescue_me_chunks WHERE metadata->>'data_type' IS NULL;")
}

seedFacts()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Fatal error:', err)
    process.exit(1)
  })
