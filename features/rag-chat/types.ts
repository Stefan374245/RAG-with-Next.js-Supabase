/**
 * Was macht types.ts?
 *
 * - Definiert zentrale TypeScript-Typen und Interfaces für das RAG-Chat-Feature.
 * - Typische Inhalte: KnowledgeItem, ChatMessage, ggf. weitere Strukturen für Dokumente, Quellen, Metadaten etc.
 * - Wird von allen Services und Komponenten im RAG-Chat genutzt, um Typsicherheit und klare Schnittstellen zu gewährleisten.
 * - Erleichtert die Wartung und Weiterentwicklung, da alle relevanten Typen an einer Stelle gepflegt werden.
 *
 * Kurz: types.ts ist die zentrale Typdefinition für alle Datenstrukturen im RAG-Chat-Modul.
 */

// Feature-local Types for RAG Chat

export interface ChatInputProps {
  onSend: (message: string) => void
  isLoading: boolean
  disabled?: boolean
}

export interface MessageBubbleProps {
  message: {
    id: string
    role: string
    content: string
  }
  isStreaming?: boolean
}

export interface SourceListProps {
  sources: Array<{
    id: string
    title: string
    content: string
    similarity: number
  }>
}
