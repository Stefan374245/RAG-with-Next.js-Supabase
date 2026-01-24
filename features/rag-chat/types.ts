// Feature-local Types for RAG Chat

export interface ChatInputProps {
  onSend: (message: string) => void
  isLoading: boolean
  disabled?: boolean
}

export interface MessageBubbleProps {
  message: {
    id: string
    role: 'user' | 'assistant'
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
