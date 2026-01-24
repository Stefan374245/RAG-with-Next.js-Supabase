'use client'

import * as React from 'react'
import { useChat } from 'ai/react'
import { Card } from '../../../components/ui/card'
import { Spinner } from '../../../components/ui/spinner'
import { MessageBubble } from './message-bubble'
import { ChatInput } from '../components/chat-input'
import { SourceList } from './source-list'
import { ErrorBoundary } from './error-boundary'
import { Bot, User } from 'lucide-react'
import { ChatHistoryService } from '../services/chat-history-service'

/**
 * Main Chat Window Container - Smart Component
 * Uses Vercel AI SDK's useChat hook for state management and streaming
 */
export function ChatWindow() {
  const messagesEndRef = React.useRef<HTMLDivElement>(null)
  const [sources, setSources] = React.useState<any[]>([])
  const [sessionId, setSessionId] = React.useState<string>('')

  // Initialize session ID
  React.useEffect(() => {
    const id = ChatHistoryService.generateSessionId()
    setSessionId(id)
  }, [])

  const { messages, append, isLoading, error, setMessages } = useChat({
    api: '/api/chat',
    onFinish: async (message) => {
      // Extract sources from message annotations if available
      try {
        const annotations = (message as any).annotations
        if (annotations?.sources) {
          setSources(annotations.sources)
        }

        // Save assistant message to history
        if (sessionId) {
          await ChatHistoryService.saveMessage(
            sessionId,
            message.content,
            'assistant',
            annotations?.sources
          )
        }
      } catch (err) {
        console.error('Error extracting sources:', err)
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

  const handleSend = async (message: string) => {
    // Save user message to history
    if (sessionId) {
      await ChatHistoryService.saveMessage(sessionId, message, 'user')
    }

    await append({
      role: 'user',
      content: message,
    })
  }

  return (
    <ErrorBoundary>
      <Card variant="elevated" className="w-full h-full flex flex-col shadow-lg">
        {/* Header - Compact */}
        <div className="flex items-center gap-2 p-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <Bot className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">RAG Assistant</h2>
            <p className="text-xs text-blue-100">Powered by React 19 & Next.js 15</p>
          </div>
        </div>

        {/* Messages Area - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <Bot className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-base font-medium text-gray-900 mb-2">
                  Willkommen beim RAG Assistant
                </h3>
                <p className="text-sm text-gray-600 max-w-md">
                  Stelle Fragen über React, Next.js, RAG-Systeme oder die Vercel AI SDK.
                  Das System durchsucht die Wissensdatenbank semantisch.
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

        {/* Error Display - Compact */}
        {error && (
          <div className="px-4 py-2 bg-red-50 border-t border-red-200">
            <p className="text-xs text-red-600">
              <strong>Fehler:</strong> {error.message}
            </p>
          </div>
        )}

        {/* Input Area - Compact */}
        <div className="p-4 border-t border-gray-200 bg-white">
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
