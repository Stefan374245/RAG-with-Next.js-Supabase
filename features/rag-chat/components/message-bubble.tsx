'use client'

import * as React from 'react'
import { cn, formatTimestamp } from '../../../lib/utils'
import type { MessageBubbleProps } from '../types'

/**
 * Message Bubble Component - Pure Presentational Component
 * React Compiler automatically memoizes this without manual memo()
 */
export function MessageBubble({ message, isStreaming = false }: MessageBubbleProps) {
  const isUser = message.role === 'user'

  return (
    <div
      className={cn(
        'flex w-full mb-4 animate-in fade-in slide-in-from-bottom-2 duration-300',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      <div
        className={cn(
          'max-w-[80%] rounded-2xl px-4 py-3 shadow-sm',
          isUser
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-900'
        )}
      >
        <div className="whitespace-pre-wrap break-words">
          {message.content}
          {isStreaming && (
            <span className="inline-block w-2 h-4 ml-1 bg-current animate-pulse" />
          )}
        </div>
        <div
          className={cn(
            'text-xs mt-1',
            isUser ? 'text-blue-100' : 'text-gray-500'
          )}
        >
          {formatTimestamp(new Date())}
        </div>
      </div>
    </div>
  )
}
