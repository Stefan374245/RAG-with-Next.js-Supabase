'use client'

import * as React from 'react'
import { Info, Settings, Trash2, Database } from 'lucide-react'
import { cn } from '../../../lib/utils'
import { ChatHistoryService } from '../services/chat-history-service'

interface CompactSidebarProps {
  onOpenSystemInfo: () => void
  onClearHistory?: () => void
}

/**
 * Compact Sidebar Component
 * Expands on hover to show options
 */
export function CompactSidebar({ onOpenSystemInfo, onClearHistory }: CompactSidebarProps) {
  const [isExpanded, setIsExpanded] = React.useState(false)
  const [isClearing, setIsClearing] = React.useState(false)

  const handleClearHistory = async () => {
    if (!window.confirm('Wirklich ALLE Chat-Sessions löschen? Diese Aktion kann nicht rückgängig gemacht werden!')) {
      return
    }

    setIsClearing(true)
    try {
      // Get all sessions
      const sessions = await ChatHistoryService.getAllSessions()
      
      // Delete each session
      for (const session of sessions) {
        await ChatHistoryService.deleteSession(session.session_id)
      }
      
      // Also clear localStorage
      localStorage.clear()
      
      alert(`${sessions.length} Chat-Sessions gelöscht!`)
      
      // Notify parent and reload
      if (onClearHistory) {
        onClearHistory()
      }
      
      // Reload page to reset state
      window.location.reload()
    } catch (error) {
      console.error('Error clearing history:', error)
      alert('Fehler beim Löschen des Verlaufs')
    } finally {
      setIsClearing(false)
    }
  }

  const handleClearCache = async () => {
    if (!window.confirm('Browser-Cache vollständig leeren? Die Seite wird neu geladen.')) {
      return
    }

    try {
      // 1. Clear all browser caches (Cache API)
      if ('caches' in window) {
        const cacheNames = await caches.keys()
        await Promise.all(cacheNames.map(name => caches.delete(name)))
        console.log('Browser caches cleared:', cacheNames)
      }
      
      // 2. Clear session storage completely
      sessionStorage.clear()
      
      // 3. Clear service worker caches if available
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations()
        for (const registration of registrations) {
          await registration.unregister()
        }
      }
      
      // 4. Clear any temp/cache data from localStorage (but keep chat history)
      const chatKeys = Object.keys(localStorage).filter(key => 
        key.startsWith('chat_') || key.startsWith('session_')
      )
      localStorage.clear()
      // Restore chat-related keys
      chatKeys.forEach(key => {
        const value = localStorage.getItem(key)
        if (value) localStorage.setItem(key, value)
      })
      
      alert('✅ Cache vollständig geleert!\nSeite wird neu geladen...')
      
      // Force reload without cache
      window.location.reload()
    } catch (error) {
      console.error('Error clearing cache:', error)
      alert('Fehler beim Leeren des Caches: ' + error)
    }
  }

  return (
    <div
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      className={cn(
        'fixed left-0 top-0 h-screen bg-gradient-to-b from-gray-900 to-gray-800 shadow-2xl transition-all duration-300 z-30',
        isExpanded ? 'w-56' : 'w-16'
      )}
    >
      <div className="flex flex-col h-full py-6">
        {/* Logo/Icon */}
        <div className="px-4 mb-8">
          <div className={cn(
            "w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center",
            "transition-all duration-300",
            isExpanded && "w-full h-12"
          )}>
            <Settings className={cn(
              "text-white transition-all",
              isExpanded ? "w-6 h-6" : "w-5 h-5"
            )} />
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 px-3 space-y-2">
          {/* System Info */}
          <button
            onClick={onOpenSystemInfo}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-3 rounded-lg',
              'text-gray-300 hover:bg-gray-700 hover:text-white',
              'transition-all duration-200 group'
            )}
          >
            <Info className="w-5 h-5 flex-shrink-0" />
            {isExpanded && (
              <span className="text-sm font-medium animate-in fade-in slide-in-from-left-2">
                System Info
              </span>
            )}
          </button>

          {/* Divider */}
          {isExpanded && (
            <div className="h-px bg-gray-700 my-4 animate-in fade-in" />
          )}

          {/* Clear History */}
          <button
            onClick={handleClearHistory}
            disabled={isClearing}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-3 rounded-lg',
              'text-gray-300 hover:bg-red-600 hover:text-white',
              'transition-all duration-200 group',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            <Trash2 className="w-5 h-5 flex-shrink-0" />
            {isExpanded && (
              <span className="text-sm font-medium animate-in fade-in slide-in-from-left-2">
                {isClearing ? 'Löschen...' : 'Clear History'}
              </span>
            )}
          </button>

          {/* Clear Cache */}
          <button
            onClick={handleClearCache}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-3 rounded-lg',
              'text-gray-300 hover:bg-gray-700 hover:text-white',
              'transition-all duration-200 group'
            )}
          >
            <Database className="w-5 h-5 flex-shrink-0" />
            {isExpanded && (
              <span className="text-sm font-medium animate-in fade-in slide-in-from-left-2">
                Clear Cache
              </span>
            )}
          </button>
        </nav>

        {/* Bottom Section */}
        {isExpanded && (
          <div className="px-4 pt-4 border-t border-gray-700 animate-in fade-in slide-in-from-left-2">
            <p className="text-xs text-gray-400">
              RAG Challenge Demo
            </p>
            <p className="text-xs text-gray-500 mt-1">
              v1.0.0
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
