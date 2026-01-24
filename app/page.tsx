import { ChatWindowWithHistory } from '../features/rag-chat/components/chat-window-with-history'
import { Sparkles, Database, Zap } from 'lucide-react'

export default function Home() {
  return (
    <main className="h-screen overflow-hidden flex flex-col py-6 pl-20 pr-4 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto w-full flex flex-col h-full">
        {/* Hero Section - Compact */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="w-6 h-6 text-blue-600" />
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              RAG Challenge Demo
            </h1>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Semantische Suche mit Retrieval-Augmented Generation
          </p>
          
          {/* Tech Stack Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-600 rounded-full shadow-md">
              <Zap className="w-3.5 h-3.5 text-white" />
              <span className="font-semibold text-white">Next.js 15 + React 19</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-600 rounded-full shadow-md">
              <Database className="w-3.5 h-3.5 text-white" />
              <span className="font-semibold text-white">Supabase + pgvector</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-purple-600 rounded-full shadow-md">
              <Sparkles className="w-3.5 h-3.5 text-white" />
              <span className="font-semibold text-white">Vercel AI SDK</span>
            </div>
          </div>
        </div>

        {/* Chat Interface - Takes remaining space */}
        <div className="flex-1 min-h-0 mb-4">
          <ChatWindowWithHistory />
        </div>

        {/* Features Section - Compact */}
        <div className="grid md:grid-cols-3 gap-3 text-center">
          <div className="bg-white/80 backdrop-blur-sm p-3 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center justify-center gap-2">
              <Database className="w-4 h-4 text-blue-600" />
              <h3 className="text-xs font-semibold text-gray-900">Vector Search</h3>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm p-3 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center justify-center gap-2">
              <Zap className="w-4 h-4 text-green-600" />
              <h3 className="text-xs font-semibold text-gray-900">Real-time Streaming</h3>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm p-3 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <h3 className="text-xs font-semibold text-gray-900">React 19 Features</h3>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
