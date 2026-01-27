import type { KnowledgeItem } from '../../../types'

/**
 * Wie arbeitet llm-service.ts mit page.tsx zusammen?
 *
 * - page.tsx zeigt das Chat-UI (über ChatWindowWithHistory) und sendet User-Fragen an die API (/api/chat/route.ts).
 * - Die API ruft buildRAGPrompt (aus llm-service.ts) auf, um einen System-Prompt für das LLM zu bauen.
 * - buildRAGPrompt bekommt die User-Frage und die gefundenen Wissensquellen (aus der Datenbank).
 * - Der Prompt wird so gebaut, dass das LLM NUR aus den gefundenen Dokumenten antwortet.
 * - Die LLM-Antwort wird dann von der API zurück an das Frontend (page.tsx) gestreamt und angezeigt.
 *
 * Kurz: llm-service.ts ist das Bindeglied zwischen Datenbankwissen und LLM-Antwort – und sorgt dafür, dass die KI nur aus echten Dokumenten antwortet.
 */


/**
 * Erzeugt einen Prompt für Retrieval-Augmented Generation (RAG), um eine KI dazu zu bringen,
 * ausschließlich auf Basis bereitgestellter Dokumente (KnowledgeItems) zu antworten.
 *
 * - Wenn keine Quellen gefunden wurden, wird eine standardisierte Antwort generiert, die auf das Fehlen von Informationen hinweist.
 * - Wenn Quellen vorhanden sind, wird ein strukturierter Prompt mit Kontext und strikten Antwortregeln erstellt.
 *
 * @param userQuery Die vom Nutzer gestellte Frage.
 * @param sources   Eine Liste von KnowledgeItems, die als Kontext für die Antwort dienen.
 * @returns         Einen deutschsprachigen Prompt, der die KI zur kontextbasierten Beantwortung der Nutzerfrage anleitet.
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
 * Extrahiert Schlüsselwörter aus einer gegebenen Abfrage, indem häufige Stoppwörter entfernt werden.
 *
 * @param query - Die Eingabeabfrage als Zeichenkette.
 * @returns Ein Array von bedeutungsvollen Begriffen ohne Stoppwörter und Wörter mit weniger als drei Zeichen.
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
