'use client'

import * as React from 'react'
import { useChat } from 'ai/react'
import { Card } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { MessageBubble } from './message-bubble'
import { ChatInput } from './chat-input'
import { SourceList } from './source-list'
import { ErrorBoundary } from './error-boundary'
import { Bot, User } from 'lucide-react'

/**
 * Main Chat Window Container - Smart Component
 * Uses Vercel AI SDK's useChat hook for state management and streaming
 */
export function ChatWindow() {
  const messagesEndRef = React.useRef<HTMLDivElement>(null)
  const [sources, setSources] = React.useState<any[]>([])

  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: '/api/chat',
    onFinish: (message, options) => {
      // Extract sources from response metadata if available
      if (options?.data?.sources) {
        setSources(options.data.sources)
      }
    },
    onError: (error) => {
      console.error('Chat error:', error)
    },
  })

  // Auto-scroll to bottom when new messages arrive
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = (message: string) => {
    handleSubmit(new Event('submit') as any, {
      data: { message },
    })
  }

  return (
    <ErrorBoundary>
      <Card variant="elevated" className="w-full max-w-4xl mx-auto h-[700px] flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 p-6 border-b border-gray-200">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">RAG Assistant</h2>
            <p className="text-sm text-gray-500">Powered by React 19 & Next.js 15</p>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <Bot className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Willkommen beim RAG Assistant
                </h3>
                <p className="text-gray-600 max-w-md">
                  Stelle Fragen über React, Next.js, RAG-Systeme oder die Vercel AI SDK.
                  Das System durchsucht die Wissensdatenbank semantisch und generiert
                  präzise Antworten.
                </p>
              </div>
            </div>
          ) : (
            <>
              {messages.map((message, index) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isStreaming={isLoading && index === messages.length - 1 && message.role === 'assistant'}
                />
              ))}
              
              {/* Show sources after assistant response */}
              {sources.length > 0 && !isLoading && (
                <SourceList sources={sources} />
              )}
              
              {/* Loading indicator */}
              {isLoading && messages[messages.length - 1]?.role === 'user' && (
                <div className="flex items-center gap-2 text-gray-500 mb-4">
                  <Spinner size="sm" />
                  <span className="text-sm">Durchsuche Wissensdatenbank...</span>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="px-6 py-3 bg-red-50 border-t border-red-200">
            <p className="text-sm text-red-600">
              <strong>Fehler:</strong> {error.message}
            </p>
          </div>
        )}

        {/* Input Area */}
        <div className="p-6 border-t border-gray-200">
          <ChatInput
            onSend={handleSend}
            isLoading={isLoading}
            disabled={!!error}
          />
        </div>
      </Card>
    </ErrorBoundary>
  )
}
