import { ChatWindow } from '../features/rag-chat/components/chat-window'
import { Sparkles, Database, Zap } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              RAG Challenge Demo
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
            Semantische Suche mit Retrieval-Augmented Generation
          </p>
          
          {/* Tech Stack Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-gray-200">
              <Zap className="w-4 h-4 text-blue-600" />
              <span className="font-medium">Next.js 15 + React 19</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-gray-200">
              <Database className="w-4 h-4 text-green-600" />
              <span className="font-medium">Supabase + pgvector</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-gray-200">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="font-medium">Vercel AI SDK</span>
            </div>
          </div>
        </div>

        {/* Chat Interface */}
        <ChatWindow />

        {/* Features Section */}
        <div className="mt-12 grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
              <Database className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Vector Search</h3>
            <p className="text-sm text-gray-600">
              Semantische Suche mit pgvector und OpenAI Embeddings für präzise Ergebnisse
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-3">
              <Zap className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Real-time Streaming</h3>
            <p className="text-sm text-gray-600">
              LLM-Antworten werden in Echtzeit gestreamt für optimale User Experience
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
              <Sparkles className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">React 19 Features</h3>
            <p className="text-sm text-gray-600">
              React Compiler, Server Actions und moderne Hooks für Clean Code
            </p>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-gray-500">
          <p>
            Built with Next.js 15, React 19, Vercel AI SDK, Supabase, and OpenAI
          </p>
        </footer>
      </div>
    </main>
  )
}
