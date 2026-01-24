'use client'

import * as React from 'react'
import { Button } from '../../../components/ui/button'
import { Send } from 'lucide-react'
import { cn } from '../../../lib/utils'
import { APP_CONFIG } from '../../../lib/constants'

export interface ChatInputProps {
  onSend: (message: string) => void
  disabled?: boolean
  isLoading?: boolean
  placeholder?: string
}

/**
 * Chat Input Component
 * Handles user message input with send button
 */
export function ChatInput({
  onSend,
  disabled = false,
  isLoading = false,
  placeholder = 'Stelle eine Frage...',
}: ChatInputProps) {
  const [input, setInput] = React.useState('')
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || disabled || isLoading) return

    onSend(input.trim())
    setInput('')

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  // Auto-resize textarea
  React.useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    textarea.style.height = 'auto'
    textarea.style.height = `${textarea.scrollHeight}px`
  }, [input])

  const isOverLimit = input.length > APP_CONFIG.MAX_MESSAGE_LENGTH

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="flex items-center">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          className={cn(
            'w-full resize-none rounded-xl glass-strong px-5 py-4 pr-14',
            'text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary/50',
            'disabled:cursor-not-allowed disabled:opacity-50 border border-white/10',
            'min-h-[56px] max-h-[200px] transition-all duration-300',
            'hover:border-white/20 focus:shadow-glow-primary',
            isOverLimit && 'border-red-500/50 focus:ring-red-500 focus:shadow-none'
          )}
          style={{ overflowY: input.length > 100 ? 'auto' : 'hidden' }}
        />
        
        <Button
          type="submit"
          size="sm"
          disabled={disabled || isLoading || !input.trim() || isOverLimit}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-primary hover:shadow-glow-primary transition-all duration-300 shine"
          aria-label="Nachricht senden"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
      
      {isOverLimit && (
        <p className="mt-2 text-sm text-red-400 animate-in fade-in slide-in-from-bottom-2">
          Nachricht zu lang ({input.length}/{APP_CONFIG.MAX_MESSAGE_LENGTH} Zeichen)
        </p>
      )}
    </form>
  )
}
