'use client'

import * as React from 'react'
import { Card } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { Badge } from '../../../components/ui/badge'
import { 
  Settings, 
  Info, 
  Database, 
  Sparkles, 
  Zap,
  ChevronRight,
  History,
  Trash2,
  MessageSquare
} from 'lucide-react'
import { ChatHistoryService, ChatSession } from '../services/chat-history-service'
import { Spinner } from '../../../components/ui/spinner'
import { cn } from '../../../lib/utils'

interface SystemAsideProps {
  currentSessionId: string
  onLoadSession: (sessionId: string) => void
  onNewChat: () => void
}

/**
 * Modern System Aside Component
 * Combines system info, controls, and chat history
 */
export function SystemAside({ currentSessionId, onLoadSession, onNewChat }: SystemAsideProps) {
  const [activeTab, setActiveTab] = React.useState<'info' | 'history'>('info')
  const [sessions, setSessions] = React.useState<ChatSession[]>([])
  const [isLoading, setIsLoading] = React.useState(false)

  // Load sessions when switching to history tab
  React.useEffect(() => {
    if (activeTab === 'history') {
      loadSessions()
    }
  }, [activeTab])

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

    if (diffMins < 1) return 'Jetzt'
    if (diffMins < 60) return `${diffMins}m`
    if (diffHours < 24) return `${diffHours}h`
    if (diffDays < 7) return `${diffDays}d`
    
    return date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })
  }

  const truncateMessage = (message: string, maxLength: number = 40) => {
    if (message.length <= maxLength) return message
    return message.substring(0, maxLength) + '...'
  }

  return (
    <aside className="w-80 h-full flex flex-col bg-gradient-to-b from-gray-50 to-white border-l border-gray-200 shadow-xl">
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 bg-white">
        <button
          onClick={() => setActiveTab('info')}
          className={cn(
            'flex-1 px-4 py-3 text-sm font-medium transition-colors relative',
            activeTab === 'info' 
              ? 'text-blue-600 bg-blue-50' 
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          )}
        >
          <div className="flex items-center justify-center gap-2">
            <Info className="w-4 h-4" />
            <span>System Info</span>
          </div>
          {activeTab === 'info' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={cn(
            'flex-1 px-4 py-3 text-sm font-medium transition-colors relative',
            activeTab === 'history' 
              ? 'text-blue-600 bg-blue-50' 
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          )}
        >
          <div className="flex items-center justify-center gap-2">
            <History className="w-4 h-4" />
            <span>Verlauf</span>
          </div>
          {activeTab === 'history' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
          )}
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'info' ? (
          <div className="space-y-6">
            {/* System Overview */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                RAG System
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed mb-4">
                Ein Retrieval-Augmented Generation System kombiniert semantische Suche 
                mit KI-Textgenerierung für präzise, kontextbasierte Antworten.
              </p>
              
              <div className="space-y-3">
                <Card className="p-3 bg-blue-50 border-blue-200">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
                      <Database className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-gray-900 mb-1">1. Vector Search</h4>
                      <p className="text-xs text-gray-600">
                        Deine Frage wird in einen Vektor umgewandelt und semantisch 
                        in der Wissensdatenbank gesucht.
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-3 bg-green-50 border-green-200">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center flex-shrink-0">
                      <Zap className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-gray-900 mb-1">2. Context Retrieval</h4>
                      <p className="text-xs text-gray-600">
                        Die relevantesten Dokumente werden als Kontext für die 
                        KI bereitgestellt.
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-3 bg-purple-50 border-purple-200">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-gray-900 mb-1">3. AI Generation</h4>
                      <p className="text-xs text-gray-600">
                        Die KI generiert eine Antwort basierend auf dem gefundenen 
                        Kontext und deiner Frage.
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Tech Stack */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Settings className="w-4 h-4 text-gray-600" />
                Technologie Stack
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-gray-200">
                  <span className="text-xs font-medium text-gray-700">Framework</span>
                  <Badge variant="default" className="bg-blue-600">Next.js 15</Badge>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-gray-200">
                  <span className="text-xs font-medium text-gray-700">UI Library</span>
                  <Badge variant="default" className="bg-blue-600">React 19</Badge>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-gray-200">
                  <span className="text-xs font-medium text-gray-700">Database</span>
                  <Badge variant="default" className="bg-green-600">Supabase</Badge>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-gray-200">
                  <span className="text-xs font-medium text-gray-700">Vector DB</span>
                  <Badge variant="default" className="bg-green-600">pgvector</Badge>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-gray-200">
                  <span className="text-xs font-medium text-gray-700">AI SDK</span>
                  <Badge variant="default" className="bg-purple-600">Vercel AI</Badge>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-gray-200">
                  <span className="text-xs font-medium text-gray-700">LLM</span>
                  <Badge variant="default" className="bg-purple-600">OpenAI</Badge>
                </div>
              </div>
            </div>

            {/* Features */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Features</h3>
              <ul className="space-y-2 text-xs text-gray-600">
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>Semantische Suche mit OpenAI Embeddings</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>Real-time Streaming der KI-Antworten</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>Automatische Chat-History Speicherung</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>Quellenangaben für Transparenz</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>React Server Components & Actions</span>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          // History Tab
          <div className="space-y-4">
            <Button
              onClick={onNewChat}
              size="sm"
              className="w-full"
              variant="primary"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Neuer Chat
            </Button>

            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Spinner size="sm" />
              </div>
            ) : sessions.length === 0 ? (
              <div className="text-center py-8">
                <History className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">Noch keine Chats</p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Letzte Chats
                </p>
                {sessions.map((session) => (
                  <button
                    key={session.session_id}
                    onClick={() => onLoadSession(session.session_id)}
                    className={cn(
                      'w-full text-left p-3 rounded-lg transition-all group',
                      'hover:bg-blue-50 hover:border-blue-200 border border-transparent',
                      session.session_id === currentSessionId && 'bg-blue-50 border-blue-200 shadow-sm'
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate mb-1">
                          {truncateMessage(session.last_message)}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">
                            {formatDate(session.created_at)}
                          </span>
                          <span className="text-xs text-gray-400">
                            • {session.message_count} Msg
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => handleDelete(session.session_id, e)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-100 rounded transition-opacity"
                        aria-label="Löschen"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-red-600" />
                      </button>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  )
}
