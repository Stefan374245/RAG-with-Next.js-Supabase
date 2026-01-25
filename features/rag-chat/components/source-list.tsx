'use client'

import * as React from 'react'
import { Card } from '../../../components/ui/card'
import { Badge } from '../../../components/ui/badge'
import { ChevronDown, ChevronUp, FileText } from 'lucide-react'
import type { SourceListProps } from '../types'

/**
 * Source Citations Component
 * Displays retrieved knowledge items with collapsible content
 */
export function SourceList({ sources }: SourceListProps) {
  const [expanded, setExpanded] = React.useState(false)

  if (!sources || sources.length === 0) {
    return null
  }

  return (
    <Card variant="bordered" className="mb-4 overflow-hidden glass-strong border-white/10">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 hover:glass transition-all duration-300 group"
      >
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-primary-light group-hover:scale-110 transition-transform duration-300" />
          <span className="font-medium text-white">
            {sources.length} relevante Quelle{sources.length !== 1 ? 'n' : ''} gefunden
          </span>
        </div>
        {expanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
        )}
      </button>

      {expanded && (
        <div className="border-t border-white/10 p-4 space-y-3 animate-in slide-in-from-top-2">
          {sources.map((source, index) => (
            <div
              key={source.id}
              className="p-4 glass rounded-xl hover:glass-strong transition-all duration-300 hover-lift border border-white/5"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-primary-light">
                    [{index + 1}]
                  </span>
                  <span className="text-sm font-medium text-white">
                    {source.title}
                  </span>
                </div>
                <Badge variant="default" className="bg-gradient-primary text-white border-0 shadow-glow-primary">
                  {((source.similarity ?? 0) * 100).toFixed(0)}% Match
                </Badge>
              </div>
              <p className="text-sm text-gray-400 line-clamp-3 leading-relaxed">
                {source.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
