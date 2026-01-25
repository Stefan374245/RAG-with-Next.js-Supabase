import type { KnowledgeItem } from '../../../types'

/**
 * Build an optimized RAG system prompt with retrieved context
 * Injects relevant knowledge items into the prompt for better LLM responses
 */
export function buildRAGPrompt(
  userQuery: string,
  sources: KnowledgeItem[]
): string {
  // If no sources found, refuse to answer from training data
  if (sources.length === 0) {
    return `Du bist TechStack Advisor - ein technischer Dokumentations-Assistent.

⛔ ABSOLUTE REGEL: Du darfst NUR aus bereitgestellten Dokumenten antworten!

AKTUELLE SITUATION:
- Es wurden KEINE relevanten Dokumente in der Wissensdatenbank gefunden
- Die Frage war: "${userQuery}"

🚫 VERBOTEN: Nutze NIEMALS dein vortrainiertes Wissen!

ANTWORTE EXAKT SO:
"Entschuldigung, ich habe in der Wissensdatenbank keine Informationen zu '${userQuery}' gefunden. Bitte stelle sicher, dass relevante Dokumente in die Datenbank geladen wurden, oder formuliere die Frage anders."`
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

  // Construct RAG prompt with STRICT context injection
  return `Du bist TechStack Advisor - ein technischer Dokumentations-Assistent.

⛔ ABSOLUTE REGELN:
1. Antworte AUSSCHLIESSLICH basierend auf den FOLGENDEN DOKUMENTEN
2. IGNORIERE dein vortrainiertes Wissen KOMPLETT
3. Wenn die Dokumente die Antwort nicht enthalten → sage das klar
4. NIEMALS Informationen von außerhalb der Dokumente hinzufügen

📚 VERFÜGBARE DOKUMENTE (${sources.length} gefunden):
${context}

📋 ANTWORT-FORMAT:
- Nutze NUR Informationen aus den Dokumenten oben
- Zitiere mit [1], [2], etc.
- Sei präzise und technisch
- Antworte auf Deutsch
- Wenn unsicher: "Die Dokumente enthalten keine Details zu [X]"

❓ FRAGE: ${userQuery}

💬 DEINE ANTWORT (NUR aus den Dokumenten!):`
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
