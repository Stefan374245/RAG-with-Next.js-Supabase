import { config } from 'dotenv'
import { resolve, basename } from 'path'
import { readdirSync, statSync, readFileSync } from 'fs'
import { createClient } from '@supabase/supabase-js'
import { splitTextIntoChunks } from '../lib/utils'

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

// ----------------------------------------------------------------
// OpenAI text-embedding-3-small — 1536 dimensions
// ----------------------------------------------------------------
async function generateEmbedding(text: string): Promise<number[]> {
  const { embed } = await import('ai')
  const { openai } = await import('@ai-sdk/openai')
  const { embedding } = await embed({
    model: openai.embedding('text-embedding-3-small'),
    value: text,
  })
  return embedding
}

// ----------------------------------------------------------------
// Store a single chunk in rescue_me_chunks via Supabase RPC
// ----------------------------------------------------------------
async function storeChunk(content: string, metadata: object): Promise<string> {
  const embedding = await generateEmbedding(content)
  const { data, error } = await supabase.rpc('insert_rescue_chunk', {
    p_content:   content,
    p_embedding: `[${embedding.join(',')}]`,
    p_metadata:  metadata,
  })
  if (error) throw error
  return data as string
}

// ----------------------------------------------------------------
// Parse PDF → plain text using pdf-parse
// ----------------------------------------------------------------
async function parsePdf(filePath: string): Promise<string> {
  const pdfParse = (await import('pdf-parse')).default
  const buffer = readFileSync(filePath)
  const data = await pdfParse(buffer)
  return data.text
}

// ----------------------------------------------------------------
// Extract make / model from folder structure:
//   manuals/[make]/[model]/file.pdf
// ----------------------------------------------------------------
function extractMetadata(filePath: string): { make: string; model: string; source_file: string } {
  const normalized = filePath.replace(/\\/g, '/')
  const parts = normalized.split('/')
  const manualsIdx = parts.indexOf('manuals')

  const rawMake  = parts[manualsIdx + 1] ?? 'unknown'
  const rawModel = parts[manualsIdx + 2] ?? 'unknown'

  return {
    make:        rawMake.toUpperCase(),
    model:       rawModel.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    source_file: basename(filePath),
  }
}

// ----------------------------------------------------------------
// Recursively find all PDFs in a directory
// ----------------------------------------------------------------
function findPdfs(dir: string): string[] {
  const results: string[] = []
  for (const entry of readdirSync(dir)) {
    const full = resolve(dir, entry)
    if (statSync(full).isDirectory()) {
      results.push(...findPdfs(full))
    } else if (entry.toLowerCase().endsWith('.pdf')) {
      results.push(full)
    }
  }
  return results
}

// ----------------------------------------------------------------
// Main
// ----------------------------------------------------------------
async function seedRescueMe() {
  const manualsDir = resolve(process.cwd(), 'manuals')

  console.log('🏍️  Rescue Me — Workshop Manual Seeding')
  console.log(`📂 Scanning: ${manualsDir}\n`)

  const pdfs = findPdfs(manualsDir)

  if (pdfs.length === 0) {
    console.log('⚠️  No PDFs found.')
    console.log('   Drop manuals into: manuals/[make]/[model]/manual.pdf')
    console.log('   Example: manuals/ktm/690-enduro-r/service-manual.pdf')
    process.exit(0)
  }

  console.log(`📚 Found ${pdfs.length} manual(s):`)
  pdfs.forEach(p => console.log(`   • ${p}`))
  console.log()

  let totalChunks  = 0
  let successCount = 0
  let errorCount   = 0

  for (const pdfPath of pdfs) {
    const meta = extractMetadata(pdfPath)
    console.log(`\n📖 ${meta.make} — ${meta.model}`)
    console.log(`   File: ${meta.source_file}`)

    let text: string
    try {
      text = await parsePdf(pdfPath)
      console.log(`   ✅ Parsed (${text.length.toLocaleString()} chars)`)
    } catch (err) {
      console.error(`   ❌ PDF parse failed: ${err}`)
      errorCount++
      continue
    }

    // 400 words per chunk, 40-word overlap — good balance for technical manuals
    const chunks = splitTextIntoChunks(text, 400, 40)
    totalChunks += chunks.length
    console.log(`   📦 ${chunks.length} chunks\n`)

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i]!
      if (chunk.trim().length < 80) continue // skip near-empty chunks (headers, page numbers)

      const chunkMeta = {
        ...meta,
        chunk_index:  i,
        total_chunks: chunks.length,
      }

      try {
        process.stdout.write(`   [${String(i + 1).padStart(3)}/${chunks.length}] Embedding... `)
        await storeChunk(chunk, chunkMeta)
        process.stdout.write('✅\n')
        successCount++
        await new Promise(r => setTimeout(r, 300)) // respect Gemini rate limit
      } catch (err) {
        process.stdout.write(`❌ ${err}\n`)
        errorCount++
      }
    }
  }

  console.log('\n' + '='.repeat(52))
  console.log('📊 Rescue Me Seeding Complete')
  console.log(`   ✅ Chunks stored : ${successCount}`)
  console.log(`   ❌ Failed        : ${errorCount}`)
  console.log(`   📦 Total chunks  : ${totalChunks}`)
  console.log(`   📄 PDFs processed: ${pdfs.length}`)
  console.log('='.repeat(52))

  if (successCount === 0) {
    console.error('\n❌ Nothing was stored — check your API keys and Supabase schema.')
    process.exit(1)
  }

  console.log('\n🎉 Rescue Me knowledge base ready!')
  console.log('   Next step: deploy the Supabase Edge Function')
}

seedRescueMe()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Fatal error:', err)
    process.exit(1)
  })
