'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Send } from 'lucide-react'
import { cn } from '@/lib/utils'
import { APP_CONFIG } from '@/lib/constants'
import type { ChatInputProps } from '../types'

/**
 * Chat Input Component with character counter and enter-to-send
 */
export function ChatInput({ onSend, isLoading, disabled }: ChatInputProps) {
  const [input, setInput] = React.useState('')
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const trimmed = input.trim()
    if (!trimmed || isLoading || disabled) return

    onSend(trimmed)
    setInput('')
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    if (value.length <= APP_CONFIG.MAX_MESSAGE_LENGTH) {
      setInput(value)
      
      // Auto-resize textarea
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
      }
    }
  }

  const isOverLimit = input.length > APP_CONFIG.MAX_MESSAGE_LENGTH
  const canSubmit = input.trim().length > 0 && !isLoading && !disabled && !isOverLimit

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="flex flex-col gap-2">
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Stelle eine Frage über React, Next.js oder RAG..."
            disabled={isLoading || disabled}
            rows={1}
            className={cn(
              'w-full resize-none rounded-lg border border-gray-300 px-4 py-3 pr-12',
              'focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'min-h-[52px] max-h-[200px]',
              isOverLimit && 'border-red-500 focus:ring-red-600'
            )}
          />
          <Button
            type="submit"
            size="sm"
            disabled={!canSubmit}
            className="absolute right-2 bottom-2"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">
            Drücke Enter zum Senden, Shift+Enter für neue Zeile
          </span>
          <span
            className={cn(
              'font-medium',
              isOverLimit ? 'text-red-600' : 'text-gray-500'
            )}
          >
            {input.length}/{APP_CONFIG.MAX_MESSAGE_LENGTH}
          </span>
        </div>
      </div>
    </form>
  )
}
