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
    <Card variant="bordered" className="mb-4 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          <span className="font-medium text-gray-900">
            {sources.length} relevante Quelle{sources.length !== 1 ? 'n' : ''} gefunden
          </span>
        </div>
        {expanded ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>

      {expanded && (
        <div className="border-t border-gray-200 p-4 space-y-3 animate-in slide-in-from-top-2">
          {sources.map((source, index) => (
            <div
              key={source.id}
              className="p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">
                    [{index + 1}]
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {source.title}
                  </span>
                </div>
                <Badge variant="default">
                  {(source.similarity * 100).toFixed(0)}% Match
                </Badge>
              </div>
              <p className="text-sm text-gray-600 line-clamp-3">
                {source.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
