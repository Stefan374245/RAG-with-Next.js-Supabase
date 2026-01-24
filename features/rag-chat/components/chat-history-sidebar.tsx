'use client'

import * as React from 'react'
import { Card } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { Spinner } from '../../../components/ui/spinner'
import { History, Trash2, MessageSquare } from 'lucide-react'
import { ChatHistoryService, ChatSession } from '../services/chat-history-service'
import { cn } from '../../../lib/utils'

interface ChatHistorySidebarProps {
  currentSessionId: string
  onLoadSession: (sessionId: string) => void
  onNewChat: () => void
}

/**
 * Chat History Sidebar Component
 * Displays list of previous chat sessions
 */
export function ChatHistorySidebar({
  currentSessionId,
  onLoadSession,
  onNewChat,
}: ChatHistorySidebarProps) {
  const [sessions, setSessions] = React.useState<ChatSession[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  // Load sessions on mount
  React.useEffect(() => {
    loadSessions()
  }, [])

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Gerade eben'
    if (diffMins < 60) return `Vor ${diffMins} Min`
    if (diffHours < 24) return `Vor ${diffHours} Std`
    if (diffDays < 7) return `Vor ${diffDays} Tagen`
    
    return date.toLocaleDateString('de-DE', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    })
  }

  const truncateMessage = (message: string, maxLength: number = 50) => {
    if (message.length <= maxLength) return message
    return message.substring(0, maxLength) + '...'
  }

  return (
    <Card className="w-64 h-full flex flex-col bg-white border-r border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">Chat-Verlauf</h3>
          </div>
        </div>
        <Button
          onClick={onNewChat}
          size="sm"
          className="w-full"
          variant="primary"
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          Neuer Chat
        </Button>
      </div>

      {/* Sessions List */}
      <div className="flex-1 overflow-y-auto p-2">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <Spinner size="sm" />
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-8 px-4">
            <History className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">
              Noch keine Chat-Verläufe
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {sessions.map((session) => (
              <button
                key={session.session_id}
                onClick={() => onLoadSession(session.session_id)}
                className={cn(
                  'w-full text-left p-3 rounded-lg hover:bg-gray-100 transition-colors group',
                  session.session_id === currentSessionId && 'bg-blue-50 hover:bg-blue-100'
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {truncateMessage(session.last_message)}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500">
                        {formatDate(session.created_at)}
                      </span>
                      <span className="text-xs text-gray-400">
                        • {session.message_count} Nachrichten
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleDelete(session.session_id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded transition-opacity"
                    aria-label="Löschen"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </Card>
  )
}
