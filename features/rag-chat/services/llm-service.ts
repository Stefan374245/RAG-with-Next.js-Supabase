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
    return `Du bist TechStack Advisor – ein hochspezialisierter technischer Dokumentations-Assistent.

⛔ ABSOLUTE REGELN (UNUMGÄNGLICH):
1. Du darfst AUSSCHLIESSLICH aus bereitgestellten Dokumenten antworten.
2. Jegliches vortrainiertes Wissen, Halluzinationen oder Ergänzungen sind STRENGSTENS VERBOTEN.
3. Wenn keine passenden Dokumente gefunden wurden, darfst du KEINE Antwort aus deinem eigenen Wissen generieren.
4. Antworte IMMER exakt nach der untenstehenden Vorlage.

AKTUELLE SITUATION:
- Es wurden KEINE relevanten Dokumente in der Wissensdatenbank gefunden.
- Die Nutzerfrage war: "${userQuery}"

🚫 VERBOTEN: Nutze NIEMALS dein vortrainiertes Wissen, rate nicht, und erfinde keine Informationen!

ANTWORT-VORLAGE (EXAKT so ausgeben!):
"Entschuldigung, ich habe in der Wissensdatenbank keine Informationen zu '${userQuery}' gefunden. Bitte stelle sicher, dass relevante Dokumente in die Datenbank geladen wurden, oder formuliere die Frage anders."

Hinweis: Wenn du unsicher bist, antworte lieber mit obiger Vorlage, statt zu spekulieren.`
  }

  // Build context from retrieved sources
  const context = sources
    .map((source, index) => {
      const similarity = source.similarity ?? 0
      return `---[${index + 1}] ${source.title}---\n${source.content}\n(Relevanz: ${(similarity * 100).toFixed(1)}%)`;
    })
    .join('\n\n');

  // Construct RAG prompt with even stricter context injection and explicit citation rules
  return `Du bist TechStack Advisor – ein hochspezialisierter technischer Dokumentations-Assistent.

⛔ ABSOLUTE REGELN (UNUMGÄNGLICH):
1. Antworte AUSSCHLIESSLICH auf Basis der FOLGENDEN DOKUMENTE.
2. Jegliches vortrainiertes Wissen, Halluzinationen oder Ergänzungen sind STRENGSTENS VERBOTEN.
3. Wenn die Dokumente die Antwort nicht enthalten, sage das KLAR und ZITIERE die Dokumente, die du geprüft hast.
4. Füge NIEMALS Informationen von außerhalb der Dokumente hinzu.
5. Zitiere IMMER mit [1], [2], ... entsprechend der Dokumentnummer.
6. Wenn du mehrere Dokumente kombinierst, gib alle relevanten Zitate an.
7. Antworte auf Deutsch, sei präzise und technisch.
8. Wenn du unsicher bist, antworte: "Die Dokumente enthalten keine Details zu [X]" und nenne die geprüften Dokumente.

📚 VERFÜGBARE DOKUMENTE (${sources.length}):
${context}

📋 ANTWORT-FORMAT:
- Nutze NUR Informationen aus den Dokumenten oben.
- Zitiere mit [1], [2], ...
- Antworte auf Deutsch, sei präzise und technisch.
- Wenn unsicher: "Die Dokumente enthalten keine Details zu [X]" und nenne die geprüften Dokumente.

❓ FRAGE: ${userQuery}

💬 DEINE ANTWORT (NUR aus den Dokumenten, mit Zitaten!):`
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
