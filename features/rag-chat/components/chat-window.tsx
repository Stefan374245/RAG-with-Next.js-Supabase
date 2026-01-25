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
    onResponse: (response) => {
      console.log('🔍 Chat response received:', response.status)
      console.log('📚 Check /api/test-rag?q=your-query to verify RAG is working')
    },
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
      <Card variant="elevated" className="w-full h-full flex flex-col glass-strong border border-white/10 shadow-glow-primary overflow-hidden">
        {/* Header - Modern Gradient */}
        <div className="flex items-center gap-3 p-4 border-b border-white/10 bg-gradient-to-r from-primary/20 via-primary/10 to-accent/20 backdrop-blur-xl">
          <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center shadow-glow-primary animate-pulse-glow">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">RAG Assistant</h2>
            <p className="text-xs text-gray-400 font-light">
              ✅ RAG Active | 21 Docs | Threshold: 30%
            </p>
          </div>
        </div>

        {/* Messages Area - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 bg-surface/30 backdrop-blur-sm">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center animate-in fade-in slide-in-from-bottom-2">
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glow-primary animate-float">
                  <Bot className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                Welcome to TechStack Advisor 💻
              </h3>
              <p className="text-sm text-gray-400 max-w-md font-light">
                Ask questions about JavaScript, Angular, React, Next.js, or any web development topic.
                The system searches through comprehensive developer documentation.
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
                <div className="flex items-center gap-3 text-gray-400 mb-4 glass px-4 py-3 rounded-xl animate-in fade-in slide-in-from-bottom-2">
                  <Spinner size="sm" />
                  <span className="text-sm font-light">Durchsuche Wissensdatenbank...</span>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Error Display - Modern */}
        {error && (
          <div className="px-4 py-3 glass-strong border-t border-red-500/20 backdrop-blur-xl">
            <p className="text-sm text-red-400">
              <strong className="font-semibold">Fehler:</strong> {error.message}
            </p>
          </div>
        )}

        {/* Input Area - Modern */}
        <div className="p-4 border-t border-white/10 glass backdrop-blur-xl">
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
