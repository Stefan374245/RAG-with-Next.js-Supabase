'use client'

import * as React from 'react'
import { cn, formatTimestamp } from '../../../lib/utils'
import type { MessageBubbleProps } from '../types'

/**
 * Message Bubble Component - Modern 2026 Design
 * React Compiler automatically memoizes this without manual memo()
 */
export function MessageBubble({ message, isStreaming = false }: MessageBubbleProps) {
  const isUser = message.role === 'user'

  return (
    <div
      className={cn(
        'flex w-full mb-4 animate-in fade-in slide-in-from-bottom-2 duration-500',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      <div
        className={cn(
          'max-w-[80%] rounded-2xl px-5 py-3.5 shadow-lg hover-lift transition-all duration-300',
          isUser
            ? 'bg-gradient-primary text-white shadow-glow-primary border border-primary-light/20'
            : 'glass-strong text-gray-100 border border-white/10'
        )}
      >
        <div className="whitespace-pre-wrap break-words leading-relaxed">
          {message.content}
          {isStreaming && (
            <span className="inline-block w-2 h-4 ml-1.5 bg-current animate-pulse rounded-sm" />
          )}
        </div>
        <div
          className={cn(
            'text-xs mt-2 font-light',
            isUser ? 'text-blue-100' : 'text-gray-500'
          )}
        >
          {formatTimestamp(new Date())}
        </div>
      </div>
    </div>
  )
}
