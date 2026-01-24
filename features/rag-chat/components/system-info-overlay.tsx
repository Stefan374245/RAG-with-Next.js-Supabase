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
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-in fade-in"
        onClick={onClose}
      />

      {/* Overlay Content */}
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 shadow-2xl z-50 animate-in slide-in-from-right border-l border-slate-200 dark:border-slate-700">
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                <Info className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-lg font-bold text-white">System Information</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-all duration-200 hover:scale-105"
              aria-label="Close system information"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* System Overview */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2 uppercase tracking-wide">
                <div className="p-1.5 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                  <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                RAG System Erklärung
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-5 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                Ein Retrieval-Augmented Generation System kombiniert semantische Suche 
                mit KI-Textgenerierung für präzise, kontextbasierte Antworten.
              </p>
              
              <div className="space-y-4">
                <Card className="p-5 bg-gradient-to-br from-blue-50 via-blue-50 to-blue-100 dark:from-blue-950/30 dark:via-blue-950/20 dark:to-blue-900/30 border-blue-200 dark:border-blue-800 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center flex-shrink-0 shadow-lg">
                      <Database className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-2">1. Vector Search</h4>
                      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                        Deine Frage wird in einen 1536-dimensionalen Vektor umgewandelt und semantisch 
                        in der Wissensdatenbank gesucht. pgvector nutzt HNSW-Index für schnelle Suche.
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-5 bg-gradient-to-br from-green-50 via-green-50 to-green-100 dark:from-green-950/30 dark:via-green-950/20 dark:to-green-900/30 border-green-200 dark:border-green-800 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-green-600 to-green-700 flex items-center justify-center flex-shrink-0 shadow-lg">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-2">2. Context Retrieval</h4>
                      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                        Die Top 5 relevantesten Dokumente (Similarity &gt; 0.7) werden als Kontext für die 
                        KI bereitgestellt. Dies ermöglicht präzise, faktenbasierte Antworten.
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-5 bg-gradient-to-br from-purple-50 via-purple-50 to-purple-100 dark:from-purple-950/30 dark:via-purple-950/20 dark:to-purple-900/30 border-purple-200 dark:border-purple-800 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center flex-shrink-0 shadow-lg">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-2">3. AI Generation</h4>
                      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
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
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2 uppercase tracking-wide">
                <div className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg">
                  <Database className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                </div>
                Technologie Stack
              </h3>
              <div className="space-y-2.5">
                <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-800/30 border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Framework</span>
                  <Badge className="bg-gradient-to-r from-blue-600 to-blue-700 shadow-sm">Next.js 15</Badge>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-800/30 border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">UI Library</span>
                  <Badge className="bg-gradient-to-r from-blue-600 to-blue-700 shadow-sm">React 19</Badge>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-800/30 border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Database</span>
                  <Badge className="bg-gradient-to-r from-green-600 to-green-700 shadow-sm">Supabase</Badge>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-800/30 border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Vector DB</span>
                  <Badge className="bg-gradient-to-r from-green-600 to-green-700 shadow-sm">pgvector</Badge>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-800/30 border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">AI SDK</span>
                  <Badge className="bg-gradient-to-r from-purple-600 to-purple-700 shadow-sm">Vercel AI SDK</Badge>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-800/30 border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">LLM</span>
                  <Badge className="bg-gradient-to-r from-purple-600 to-purple-700 shadow-sm">OpenAI GPT-4</Badge>
                </div>
              </div>
            </div>

            {/* Features */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4 uppercase tracking-wide">Features & Highlights</h3>
              <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
                <li className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20 border border-blue-200/50 dark:border-blue-800/50 hover:shadow-sm transition-all duration-200">
                  <ChevronRight className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <span className="font-medium">Semantische Suche mit OpenAI text-embedding-3-small</span>
                </li>
                <li className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20 border border-blue-200/50 dark:border-blue-800/50 hover:shadow-sm transition-all duration-200">
                  <ChevronRight className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <span className="font-medium">Real-time Streaming der KI-Antworten mit Server-Sent Events</span>
                </li>
                <li className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20 border border-blue-200/50 dark:border-blue-800/50 hover:shadow-sm transition-all duration-200">
                  <ChevronRight className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <span className="font-medium">Automatische Chat-History Speicherung in Supabase</span>
                </li>
                <li className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20 border border-blue-200/50 dark:border-blue-800/50 hover:shadow-sm transition-all duration-200">
                  <ChevronRight className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <span className="font-medium">Quellenangaben für Transparenz und Nachvollziehbarkeit</span>
                </li>
                <li className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20 border border-blue-200/50 dark:border-blue-800/50 hover:shadow-sm transition-all duration-200">
                  <ChevronRight className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <span className="font-medium">React Server Components & Server Actions</span>
                </li>
                <li className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20 border border-blue-200/50 dark:border-blue-800/50 hover:shadow-sm transition-all duration-200">
                  <ChevronRight className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <span className="font-medium">HNSW-Index für schnelle Vektor-Similarity-Suche</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
