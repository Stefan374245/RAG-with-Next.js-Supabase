'use client'

import * as React from 'react'
import { useChat } from 'ai/react'
import { Card } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { Spinner } from '../../../components/ui/spinner'
import { MessageBubble } from './message-bubble'
import { ChatInput } from './chat-input'
import { SourceList } from './source-list'
import { ErrorBoundary } from './error-boundary'
import { CompactSidebar } from './compact-sidebar'
import { SystemInfoOverlay } from './system-info-overlay'
import { ChatHistoryDropdown } from './chat-history-dropdown'
import { Bot } from 'lucide-react'
import { ChatHistoryService } from '../services/chat-history-service'

/**
 * Chat Window with History - Smart Component
 * Combines chat interface with session history sidebar
 */
export function ChatWindowWithHistory() {
  const messagesEndRef = React.useRef<HTMLDivElement>(null)
  const [sources, setSources] = React.useState<any[]>([])
  const [sessionId, setSessionId] = React.useState<string>('')
  const [showSystemInfo, setShowSystemInfo] = React.useState(false)

  // Initialize session ID
  React.useEffect(() => {
    const id = ChatHistoryService.generateSessionId()
    setSessionId(id)
  }, [])

  const { messages, append, isLoading, error, setMessages } = useChat({
    api: '/api/chat',
    id: sessionId, // Use session ID for chat instance
    onFinish: async (message) => {
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

  const handleLoadSession = async (loadSessionId: string) => {
    console.log('handleLoadSession called with:', loadSessionId)
    const history = await ChatHistoryService.loadSession(loadSessionId)
    console.log('Loaded history:', history)
    
    // Convert history to chat messages format
    const loadedMessages = history.map((msg) => ({
      id: msg.id,
      role: msg.role as 'user' | 'assistant',
      content: msg.message,
    }))
    
    console.log('Converted messages:', loadedMessages)

    // WICHTIG: Erst Messages leeren, dann Session ID ändern
    setMessages([])
    setSources([])
    
    // Warte kurz, dann setze neue Session ID und Messages
    setTimeout(() => {
      setSessionId(loadSessionId)
      setTimeout(() => {
        setMessages(loadedMessages as any)
      }, 50)
    }, 50)
  }

  const handleNewChat = () => {
    const newId = ChatHistoryService.generateSessionId()
    setSessionId(newId)
    setMessages([])
    setSources([])
  }

  return (
    <ErrorBoundary>
      {/* Compact Sidebar */}
      <CompactSidebar 
        onOpenSystemInfo={() => setShowSystemInfo(true)} 
        onClearHistory={() => {
          // Optional: Callback wenn History gelöscht wird
          handleNewChat()
        }}
      />

      {/* System Info Overlay */}
      <SystemInfoOverlay 
        isOpen={showSystemInfo} 
        onClose={() => setShowSystemInfo(false)} 
      />

      {/* Main Chat Window */}
      <div className="h-full w-full">
        <Card variant="elevated" className="h-full flex flex-col glass-strong border border-white/10 shadow-glow-primary rounded-xl md:rounded-2xl">
          {/* Header - Modern Dark */}
          <div className="relative z-[102] flex items-center justify-between gap-3 p-4 border-b border-white/10 bg-gradient-to-r from-primary/20 via-primary/10 to-accent/20 backdrop-blur-xl rounded-t-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center shadow-glow-primary animate-pulse-glow">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">RAG Assistant</h2>
                <p className="text-xs text-gray-400 font-light">Powered by React 19 & Next.js 15</p>
              </div>
            </div>

            {/* Chat History Dropdown */}
            <ChatHistoryDropdown
              currentSessionId={sessionId}
              onLoadSession={handleLoadSession}
              onNewChat={handleNewChat}
            />
          </div>

          {/* Messages Area - Dark Modern */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 bg-transparent">
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
                                  Stelle Fragen zu JavaScript, Angular, React, Next.js oder jedem anderen Webentwicklungs-Thema.
                                  Das System durchsucht die umfassende Entwickler-Dokumentation.
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
                
                {sources.length > 0 && !isLoading && (
                  <SourceList sources={sources} />
                )}
                
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
          <div className="p-4 border-t border-white/10 glass backdrop-blur-xl rounded-b-2xl">
            <ChatInput
              onSend={handleSend}
              isLoading={isLoading}
              disabled={!!error}
            />
          </div>
        </Card>
      </div>
    </ErrorBoundary>
  )
}
