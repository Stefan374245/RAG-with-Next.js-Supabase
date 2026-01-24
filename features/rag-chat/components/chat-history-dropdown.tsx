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
      {/* Trigger Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        size="sm"
        variant="ghost"
        className="text-white hover:bg-blue-700 gap-1"
      >
        <History className="w-4 h-4" />
        <span className="hidden sm:inline">Verlauf</span>
        <ChevronDown className={cn(
          "w-3 h-3 transition-transform",
          isOpen && "rotate-180"
        )} />
      </Button>

      {/* Backdrop - closes dropdown when clicked */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-[calc(100vw-7rem)] sm:w-96 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 animate-in fade-in slide-in-from-top-2">
          {/* Header */}
          <div className="p-3 sm:p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-900 flex items-center gap-2">
                <History className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                Chat-Verlauf
              </h3>
            </div>
            <Button
              onClick={handleNewChat}
              size="sm"
              className="w-full text-xs sm:text-sm"
              variant="primary"
            >
              <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" />
              Neuer Chat
            </Button>
          </div>

          {/* Sessions List */}
          <div className="max-h-[60vh] sm:max-h-96 overflow-y-auto p-2">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Spinner size="sm" />
              </div>
            ) : sessions.length === 0 ? (
              <div className="text-center py-6 sm:py-8 px-4">
                <History className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-2 sm:mb-3" />
                <p className="text-xs sm:text-sm text-gray-500">
                  Noch keine Chat-Verläufe
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                {sessions.map((session) => (
                  <div
                    key={session.session_id}
                    onClick={() => handleLoadSession(session.session_id)}
                    className={cn(
                      'w-full text-left p-2.5 sm:p-3 rounded-lg hover:bg-gray-100 transition-colors group cursor-pointer',
                      session.session_id === currentSessionId && 'bg-blue-50 hover:bg-blue-100'
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                          {truncateMessage(session.last_message)}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-500">
                            {formatDate(session.created_at)}
                          </span>
                          <span className="text-xs text-gray-400">
                            • {session.message_count} Nachr.
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(session.session_id, e)
                        }}
                        className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 p-1 hover:bg-red-100 rounded transition-opacity flex-shrink-0"
                        aria-label="Löschen"
                      >
                        <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-600" />
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
