'use client'

import * as React from 'react'
import { Info, Settings, Trash2, Database, Menu, X } from 'lucide-react'
import { cn } from '../../../lib/utils'
import { ChatHistoryService } from '../services/chat-history-service'

interface CompactSidebarProps {
  onOpenSystemInfo: () => void
  onClearHistory?: () => void
}

/**
 * Simple Burger Menu Icon Component
 */
function BurgerMenu({ isOpen, onClick }: { isOpen: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="glass-strong p-2 md:p-3 rounded-xl border border-white/10 hover:border-primary/30 transition-all duration-300 hover-lift shadow-glow-primary"
      aria-label="Toggle menu"
    >
      {isOpen ? (
        <X className="w-5 md:w-6 h-5 md:h-6 text-white" />
      ) : (
        <Menu className="w-5 md:w-6 h-5 md:h-6 text-white" />
      )}
    </button>
  )
}

/**
 * Compact Sidebar Component
 * Desktop: Expands on hover
 * Mobile: Controlled via Burger Menu
 */
export function CompactSidebar({ onOpenSystemInfo, onClearHistory }: CompactSidebarProps) {
  const [isExpanded, setIsExpanded] = React.useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  const [isClearing, setIsClearing] = React.useState(false)
  const [isMobile, setIsMobile] = React.useState(false)

  // Detect mobile/desktop
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

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
    <>
      {/* Burger Menu - Nur für Mobile */}
      {isMobile && (
        <div className="fixed top-4 left-4 z-50">
          <BurgerMenu
            isOpen={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />
        </div>
      )}

      {/* Backdrop für Mobile */}
      {isMobile && isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        onMouseEnter={() => !isMobile && setIsExpanded(true)}
        onMouseLeave={() => !isMobile && setIsExpanded(false)}
        className={cn(
          'fixed left-0 top-0 h-screen glass-strong shadow-glow-primary transition-all duration-500 ease-out',
          'border-r border-white/10',
          // Desktop: hover to expand, z-30
          // Mobile: burger menu control, z-50 when open
          isMobile ? 'z-50' : 'z-30',
          isMobile
            ? isMobileMenuOpen
              ? 'w-64 translate-x-0'
              : 'w-0 -translate-x-full'
            : isExpanded
            ? 'w-56'
            : 'w-16'
        )}
      >
        <div className="flex flex-col h-full py-6">
          {/* Logo/Icon */}
          <div className={cn('px-4 mb-8', isMobile && !isMobileMenuOpen && 'hidden')}>
            <div className={cn(
              "w-8 h-8 bg-gradient-primary rounded-xl flex items-center justify-center",
              "transition-all duration-500 ease-out shadow-glow-primary hover:shadow-glow-primary-lg",
              "hover:scale-105 cursor-pointer",
              (isExpanded || (isMobile && isMobileMenuOpen)) && "w-full h-12"
            )}>
              <Settings className={cn(
                "text-white transition-all duration-300 animate-pulse-glow",
                (isExpanded || (isMobile && isMobileMenuOpen)) ? "w-6 h-6" : "w-5 h-5"
              )} />
            </div>
          </div>

        {/* Menu Items */}
        <nav className={cn('flex-1 px-3 space-y-2', isMobile && !isMobileMenuOpen && 'hidden')}>
          {/* System Info */}
          <button
            onClick={() => {
              onOpenSystemInfo()
              if (isMobile) setIsMobileMenuOpen(false)
            }}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-3 rounded-xl shine',
              'text-gray-300 hover:glass-strong hover:text-white hover:border-primary/30',
              'transition-all duration-300 group border border-transparent'
            )}
          >
            <Info className="w-5 h-5 flex-shrink-0 group-hover:text-primary-light group-hover:scale-110 transition-all duration-300" />
            {(isExpanded || (isMobile && isMobileMenuOpen)) && (
              <span className="text-sm font-medium animate-in fade-in slide-in-from-left-2">
                System Info
              </span>
            )}
          </button>

          {/* Divider */}
          {(isExpanded || (isMobile && isMobileMenuOpen)) && (
            <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent my-4 animate-in fade-in" />
          )}

          {/* Clear History */}
          <button
            onClick={() => {
              handleClearHistory()
              if (isMobile) setIsMobileMenuOpen(false)
            }}
            disabled={isClearing}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-3 rounded-xl shine',
              'text-gray-300 hover:glass-strong hover:text-red-400 hover:border-red-500/30',
              'transition-all duration-300 group border border-transparent',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            <Trash2 className="w-5 h-5 flex-shrink-0 group-hover:text-red-400 group-hover:scale-110 transition-all duration-300" />
            {(isExpanded || (isMobile && isMobileMenuOpen)) && (
              <span className="text-sm font-medium animate-in fade-in slide-in-from-left-2">
                {isClearing ? 'Löschen...' : 'Clear History'}
              </span>
            )}
          </button>

          {/* Clear Cache */}
          <button
            onClick={() => {
              handleClearCache()
              if (isMobile) setIsMobileMenuOpen(false)
            }}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-3 rounded-xl shine',
              'text-gray-300 hover:glass-strong hover:text-white hover:border-primary/30',
              'transition-all duration-300 group border border-transparent'
            )}
          >
            <Database className="w-5 h-5 flex-shrink-0 group-hover:text-primary-light group-hover:scale-110 transition-all duration-300" />
            {(isExpanded || (isMobile && isMobileMenuOpen)) && (
              <span className="text-sm font-medium animate-in fade-in slide-in-from-left-2">
                Clear Cache
              </span>
            )}
          </button>
        </nav>

        {/* Bottom Section */}
        {(isExpanded || (isMobile && isMobileMenuOpen)) && (
          <div className="px-4 pt-4 border-t border-white/5 animate-in fade-in slide-in-from-left-2">
            <p className="text-xs text-gray-400 font-medium">
              RAG Challenge Demo
            </p>
            <p className="text-xs text-gray-600 mt-1">
              v1.0.0 • 2026
            </p>
          </div>
        )}
      </div>
    </div>
    </>
  )
}
