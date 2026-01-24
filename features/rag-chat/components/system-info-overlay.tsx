'use client'

import * as React from 'react'
import { Card } from '../../../components/ui/card'
import { Badge } from '../../../components/ui/badge'
import { 
  Info, 
  Database, 
  Sparkles, 
  Zap,
  ChevronRight,
  X
} from 'lucide-react'
import { cn } from '../../../lib/utils'

interface SystemInfoOverlayProps {
  isOpen: boolean
  onClose: () => void
}

/**
 * System Info Overlay Component
 * Shows detailed system information as a modal overlay
 */
export function SystemInfoOverlay({ isOpen, onClose }: SystemInfoOverlayProps) {
  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-in fade-in"
        onClick={onClose}
      />

      {/* Overlay Content */}
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 animate-in slide-in-from-right">
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700">
            <div className="flex items-center gap-2">
              <Info className="w-5 h-5 text-white" />
              <h2 className="text-lg font-semibold text-white">System Information</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-blue-700 rounded-lg transition-colors"
              aria-label="Close system information"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* System Overview */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                RAG System Erklärung
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                Ein Retrieval-Augmented Generation System kombiniert semantische Suche 
                mit KI-Textgenerierung für präzise, kontextbasierte Antworten.
              </p>
              
              <div className="space-y-4">
                <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                      <Database className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-1">1. Vector Search</h4>
                      <p className="text-sm text-gray-700">
                        Deine Frage wird in einen 1536-dimensionalen Vektor umgewandelt und semantisch 
                        in der Wissensdatenbank gesucht. pgvector nutzt HNSW-Index für schnelle Suche.
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-green-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-1">2. Context Retrieval</h4>
                      <p className="text-sm text-gray-700">
                        Die Top 5 relevantesten Dokumente (Similarity &gt; 0.7) werden als Kontext für die 
                        KI bereitgestellt. Dies ermöglicht präzise, faktenbasierte Antworten.
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-1">3. AI Generation</h4>
                      <p className="text-sm text-gray-700">
                        OpenAI GPT-4 generiert eine Antwort basierend auf dem gefundenen 
                        Kontext. Streaming ermöglicht Real-time Ausgabe der Antwort.
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Tech Stack */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Database className="w-4 h-4 text-gray-600" />
                Technologie Stack
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-200">
                  <span className="text-sm font-medium text-gray-700">Framework</span>
                  <Badge className="bg-blue-600">Next.js 15</Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-200">
                  <span className="text-sm font-medium text-gray-700">UI Library</span>
                  <Badge className="bg-blue-600">React 19</Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-200">
                  <span className="text-sm font-medium text-gray-700">Database</span>
                  <Badge className="bg-green-600">Supabase</Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-200">
                  <span className="text-sm font-medium text-gray-700">Vector DB</span>
                  <Badge className="bg-green-600">pgvector</Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-200">
                  <span className="text-sm font-medium text-gray-700">AI SDK</span>
                  <Badge className="bg-purple-600">Vercel AI SDK</Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-200">
                  <span className="text-sm font-medium text-gray-700">LLM</span>
                  <Badge className="bg-purple-600">OpenAI GPT-4</Badge>
                </div>
              </div>
            </div>

            {/* Features */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Features & Highlights</h3>
              <ul className="space-y-2.5 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>Semantische Suche mit OpenAI text-embedding-3-small</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>Real-time Streaming der KI-Antworten mit Server-Sent Events</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>Automatische Chat-History Speicherung in Supabase</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>Quellenangaben für Transparenz und Nachvollziehbarkeit</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>React Server Components & Server Actions</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>HNSW-Index für schnelle Vektor-Similarity-Suche</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
