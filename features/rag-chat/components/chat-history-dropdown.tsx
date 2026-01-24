'use client'

import * as React from 'react'
import { Button } from '../../../components/ui/button'
import { Spinner } from '../../../components/ui/spinner'
import { History, Trash2, MessageSquare, ChevronDown } from 'lucide-react'
import { ChatHistoryService, ChatSession } from '../services/chat-history-service'
import { cn } from '../../../lib/utils'

interface ChatHistoryDropdownProps {
  currentSessionId: string
  onLoadSession: (sessionId: string) => void
  onNewChat: () => void
}

/**
 * Chat History Dropdown Component
 * Shows in chat header as a dropdown menu
 */
export function ChatHistoryDropdown({ 
  currentSessionId, 
  onLoadSession, 
  onNewChat 
}: ChatHistoryDropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [sessions, setSessions] = React.useState<ChatSession[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  // Load sessions on mount
  React.useEffect(() => {
    loadSessions()
  }, [])

  // Reload sessions when dropdown opens
  React.useEffect(() => {
    if (isOpen) {
      loadSessions()
    }
  }, [isOpen])

  const loadSessions = async () => {
    setIsLoading(true)
    const data = await ChatHistoryService.getAllSessions()
    setSessions(data)
    setIsLoading(false)
  }

  const handleDelete = async (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    
    const confirmed = window.confirm('Möchtest du diese Chat-Session wirklich löschen?')
    if (!confirmed) return

    const success = await ChatHistoryService.deleteSession(sessionId)
    if (success) {
      setSessions(sessions.filter((s) => s.session_id !== sessionId))
      if (sessionId === currentSessionId) {
        onNewChat()
      }
    }
  }

  const handleLoadSession = (sessionId: string) => {
    console.log('Loading session:', sessionId)
    setIsOpen(false)
    onLoadSession(sessionId)
  }

  const handleNewChat = () => {
    onNewChat()
    setIsOpen(false)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Jetzt'
    if (diffMins < 60) return `${diffMins}m`
    if (diffHours < 24) return `${diffHours}h`
    if (diffDays < 7) return `${diffDays}d`
    
    return date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })
  }

  const truncateMessage = (message: string, maxLength: number = 50) => {
    if (message.length <= maxLength) return message
    return message.substring(0, maxLength) + '...'
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button - Modern */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        size="sm"
        variant="ghost"
        className="text-white hover:glass-strong gap-1.5 transition-all duration-300"
      >
        <History className="w-4 h-4" />
        <span className="hidden sm:inline font-medium">Verlauf</span>
        <ChevronDown className={cn(
          "w-3.5 h-3.5 transition-transform duration-300",
          isOpen && "rotate-180"
        )} />
      </Button>

      {/* Backdrop - closes dropdown when clicked */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[100]" 
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Dropdown Menu - Modern Dark */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-[calc(100vw-7rem)] sm:w-96 glass-strong rounded-2xl shadow-glow-primary border border-white/10 z-[101] animate-in fade-in slide-in-from-top-2 backdrop-blur-xl">
          {/* Header - Modern */}
          <div className="p-3 sm:p-4 border-b border-white/10">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <h3 className="text-xs sm:text-sm font-semibold text-white flex items-center gap-2">
                <History className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary-light" />
                Chat-Verlauf
              </h3>
            </div>
            <Button
              onClick={handleNewChat}
              size="sm"
              className="w-full text-xs sm:text-sm shine"
              variant="primary"
            >
              <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" />
              Neuer Chat
            </Button>
          </div>

          {/* Sessions List */}
          <div className="max-h-[60vh] sm:max-h-96 overflow-y-auto p-3 scrollbar-thin">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Spinner size="sm" />
              </div>
            ) : sessions.length === 0 ? (
              <div className="text-center py-6 sm:py-8 px-4 animate-in fade-in">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <History className="w-6 h-6 sm:w-7 sm:h-7 text-primary-light" />
                </div>
                <p className="text-sm text-gray-400 font-medium">
                  Noch keine Chat-Verläufe
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Starte einen neuen Chat oben
                </p>
              </div>
            ) : (
              <div className="space-y-1.5">
                {sessions.map((session, index) => (
                  <div
                    key={session.session_id}
                    onClick={() => handleLoadSession(session.session_id)}
                    className={cn(
                      'w-full text-left p-3 rounded-xl transition-all duration-300 group cursor-pointer border',
                      'hover:border-primary/30 hover:glass-strong hover:scale-[1.01] hover:shadow-lg',
                      session.session_id === currentSessionId 
                        ? 'glass-strong border-primary/30 shadow-glow-primary scale-[1.01]' 
                        : 'border-transparent hover-lift'
                    )}
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate group-hover:text-primary-light transition-colors">
                          {truncateMessage(session.last_message)}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-xs text-gray-400 font-medium">
                            {formatDate(session.created_at)}
                          </span>
                          <span className="text-xs text-gray-500">
                            • {session.message_count} Nachr.
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(session.session_id, e)
                        }}
                        className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 p-1.5 hover:bg-red-500/20 rounded-lg transition-all duration-300 flex-shrink-0 border border-transparent hover:border-red-500/40 hover:scale-110"
                        aria-label="Löschen"
                        title="Session löschen"
                      >
                        <Trash2 className="w-4 h-4 text-red-400 hover:text-red-300" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
