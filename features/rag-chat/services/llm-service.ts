import type { KnowledgeItem } from '../../../types'

/**
 * Build an optimized RAG system prompt with retrieved context
 * Injects relevant knowledge items into the prompt for better LLM responses
 */
export function buildRAGPrompt(
  userQuery: string,
  sources: KnowledgeItem[]
): string {
  // If no sources found, return basic prompt
  if (sources.length === 0) {
    return `Du bist ein hilfreicher Assistent. Beantworte die folgende Frage basierend auf deinem Wissen:

Frage: ${userQuery}

Hinweis: Ich konnte keine spezifischen Dokumente zu dieser Frage finden. Bitte gib eine allgemeine Antwort basierend auf deinem Training.`
  }

  // Build context from retrieved sources
  const context = sources
    .map((source, index) => {
      const similarity = source.similarity ?? 0
      return `[${index + 1}] ${source.title}
${source.content}
(Relevanz: ${(similarity * 100).toFixed(1)}%)`
    })
    .join('\n\n')

  // Construct RAG prompt with context injection
  return `Du bist ein hilfreicher Assistent für technische Dokumentation. Deine Aufgabe ist es, Fragen zu beantworten basierend auf den bereitgestellten Informationen.

WICHTIGE REGELN:
- Nutze NUR die bereitgestellten Informationen unten, um die Frage zu beantworten
- Wenn die Antwort nicht in den Informationen enthalten ist, sage das ehrlich
- Gib die Quellen an, die du für deine Antwort verwendet hast (z.B. "Laut [1]...")
- Sei präzise und konkret
- Antworte auf Deutsch

VERFÜGBARE INFORMATIONEN:
${context}

FRAGE: ${userQuery}

ANTWORT:`
}

/**
 * Extract key information from user query for better retrieval
 * Simple implementation - can be extended with more sophisticated NLP
 */
export function extractQueryKeywords(query: string): string[] {
  // Remove common stop words and extract meaningful terms
  const stopWords = new Set([
    'der', 'die', 'das', 'und', 'oder', 'aber', 'wie', 'was', 'ist', 'in', 'zu', 'mit',
    'the', 'a', 'an', 'and', 'or', 'but', 'how', 'what', 'is', 'in', 'to', 'with'
  ])

  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.has(word))
}
