/**
 * Reads a workshop manual PDF, identifies pages/chunks that contain
 * numerical specifications, and asks GPT-4o to extract ONLY the bare
 * technical facts (torque values, capacities, pressures, intervals, etc.)
 * rewritten in neutral language — no original manual text is reproduced.
 *
 * Output: data/facts/{make}/{model}.json
 *
 * Usage:
 *   npx tsx scripts/extract-facts-from-pdf.ts manuals/ktm/890-Adventure/manual.pdf
 */

import { config } from 'dotenv'
import { resolve, basename, dirname } from 'path'
import { readFileSync, writeFileSync, mkdirSync } from 'fs'

config({ path: resolve(process.cwd(), '.env.local') })

const required = ['OPENAI_API_KEY']
for (const key of required) {
  if (!process.env[key]) {
    console.error(`❌ Missing: ${key}`)
    process.exit(1)
  }
}

interface FactEntry {
  fact: string
  category: string
}

// Regex patterns that indicate a chunk likely contains specs
const SPEC_PATTERNS = [
  /\d+\s*(Nm|N·m|lbf·ft|lb-ft)/i,       // torque
  /\d+[.,]\d+\s*(L|liter|litre|ml)/i,   // fluid capacity
  /\d+[.,]\d+\s*(bar|psi|kPa)/i,        // pressure
  /\d+[.,]\d+\s*(mm|inch|in\b)/i,       // clearances
  /\d+\s*(km|miles)\b/i,                // intervals
  /\d+\s*(V|Ah|W|A)\b/,                 // electrical
  /\d+\s*T\b/,                           // sprocket teeth
  /NGK|BOSCH|DENSO/i,                   // spark plugs
  /DOT\s*[34]/i,                         // brake fluid
  /SAE|10W|15W|20W/i,                   // oil spec
  /\d+\/\d+\s*(R)?\d+/,                 // tyre sizes
]

function hasSpecs(text: string): boolean {
  return SPEC_PATTERNS.some(p => p.test(text))
}

function toDisplayMake(slug: string): string {
  const overrides: Record<string, string> = {
    ktm: 'KTM', bmw: 'BMW', husqvarna: 'Husqvarna',
    honda: 'Honda', yamaha: 'Yamaha', triumph: 'Triumph',
    ducati: 'Ducati', suzuki: 'Suzuki', kawasaki: 'Kawasaki',
  }
  return overrides[slug.toLowerCase()] ?? slug.toUpperCase()
}

function toDisplayModel(slug: string): string {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

function extractMakeModel(pdfPath: string): { make: string; model: string; outputPath: string } {
  const normalized = pdfPath.replace(/\\/g, '/')
  const manualsIdx = normalized.indexOf('/manuals/')
  const rel = normalized.slice(manualsIdx + '/manuals/'.length).split('/')
  const makeSlug  = rel[0] ?? 'unknown'
  const modelSlug = rel[1] ?? 'unknown'
  const make  = toDisplayMake(makeSlug)
  const model = toDisplayModel(modelSlug)
  const outputPath = resolve(process.cwd(), 'data', 'facts', makeSlug.toLowerCase(), `${modelSlug.toLowerCase()}.json`)
  return { make, model, outputPath }
}

async function extractFactsFromChunk(text: string, make: string, model: string): Promise<FactEntry[]> {
  const { generateText } = await import('ai')
  const { openai } = await import('@ai-sdk/openai')

  const prompt = `You are extracting technical specifications from a ${make} ${model} workshop manual.

From the following text, extract ONLY the concrete numerical specifications:
- Torque values (Nm)
- Fluid capacities (L, ml)
- Tyre pressures (bar, psi)
- Service intervals (km, miles, years)
- Part numbers / specs (spark plug types, oil grades, chain sizes, tyre sizes)
- Electrical specs (V, Ah, W)
- Clearances and adjustments (mm)

STRICT RULES:
- Output ONLY a JSON array. No explanation, no markdown, no code fence.
- Each item: { "fact": "...", "category": "..." }
- Category must be one of: torque_specs | fluids | tyre_pressures | service_intervals | consumables | electrical | adjustments
- Write each "fact" in your OWN words — do NOT copy sentences from the manual.
  Good: "Engine oil capacity with filter: 1.8 L"
  Bad:  "Fill engine with 1.8 litres of oil as specified in section 3.2 of this manual."
- If no spec is present, return: []
- No duplicates.

Text:
${text}`

  const { text: raw } = await generateText({
    model: openai('gpt-4o'),
    prompt,
    maxTokens: 800,
    temperature: 0,
  })

  try {
    const cleaned = raw.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim()
    const parsed = JSON.parse(cleaned) as FactEntry[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function deduplicateFacts(facts: FactEntry[]): FactEntry[] {
  const seen = new Set<string>()
  return facts.filter(f => {
    const key = f.fact.toLowerCase().replace(/\s+/g, ' ').trim()
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

async function extractFactsFromPdf(pdfPath: string) {
  const absPath = resolve(process.cwd(), pdfPath)
  const { make, model, outputPath } = extractMakeModel(absPath)

  console.log(`🏍️  Fact Extraction — ${make} ${model}`)
  console.log(`📖 PDF: ${basename(absPath)}`)
  console.log(`📄 Output: ${outputPath}\n`)

  // Parse PDF
  console.log('📑 Parsing PDF...')
  const pdfParse = (await import('pdf-parse')).default
  const buffer = readFileSync(absPath)
  const { text: fullText } = await pdfParse(buffer)
  console.log(`   ${fullText.length.toLocaleString()} chars total`)

  // Split into ~1500-char chunks with some overlap
  const CHUNK_SIZE  = 1500
  const OVERLAP     = 150
  const chunks: string[] = []
  let pos = 0
  while (pos < fullText.length) {
    chunks.push(fullText.slice(pos, pos + CHUNK_SIZE))
    pos += CHUNK_SIZE - OVERLAP
  }

  // Filter to only chunks that look like they contain specs
  const specChunks = chunks.filter(hasSpecs)
  console.log(`   ${chunks.length} chunks total → ${specChunks.length} contain specs\n`)

  const allFacts: FactEntry[] = []
  let processed = 0

  for (const chunk of specChunks) {
    processed++
    process.stdout.write(`   [${String(processed).padStart(3)}/${specChunks.length}] Extracting...`)

    try {
      const facts = await extractFactsFromChunk(chunk, make, model)
      allFacts.push(...facts)
      process.stdout.write(facts.length > 0 ? ` ${facts.length} facts ✅\n` : ` (none)\n`)
      // small delay to respect rate limits
      await new Promise(r => setTimeout(r, 300))
    } catch (err) {
      process.stdout.write(` ❌ ${err}\n`)
    }
  }

  const deduplicated = deduplicateFacts(allFacts)

  console.log(`\n📊 Extracted ${allFacts.length} raw facts → ${deduplicated.length} after deduplication`)

  // Ensure output directory exists
  mkdirSync(dirname(outputPath), { recursive: true })
  writeFileSync(outputPath, JSON.stringify(deduplicated, null, 2), 'utf-8')

  console.log(`\n✅ Saved to ${outputPath}`)
  console.log('\nNext steps:')
  console.log('  1. Review the JSON file and verify values against your manual')
  console.log('  2. npm run seed:facts')
  console.log("  3. DELETE FROM rescue_me_chunks WHERE metadata->>'data_type' IS NULL;")
}

const pdfArg = process.argv[2]
if (!pdfArg) {
  console.error('Usage: npx tsx scripts/extract-facts-from-pdf.ts <path-to-pdf>')
  console.error('Example: npx tsx scripts/extract-facts-from-pdf.ts manuals/ktm/890-Adventure/manual.pdf')
  process.exit(1)
}

extractFactsFromPdf(pdfArg)
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Fatal:', err)
    process.exit(1)
  })
