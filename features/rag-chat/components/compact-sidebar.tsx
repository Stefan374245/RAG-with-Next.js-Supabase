'use client'

import * as React from 'react'
import { Info, Settings } from 'lucide-react'
import { cn } from '../../../lib/utils'

interface CompactSidebarProps {
  onOpenSystemInfo: () => void
}

/**
 * Compact Sidebar Component
 * Expands on hover to show options
 */
export function CompactSidebar({ onOpenSystemInfo }: CompactSidebarProps) {
  const [isExpanded, setIsExpanded] = React.useState(false)

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
