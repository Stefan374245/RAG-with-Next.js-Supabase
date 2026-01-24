import { ChatWindowWithHistory } from '../features/rag-chat/components/chat-window-with-history'
import { Sparkles, Database, Zap } from 'lucide-react'

export default function Home() {
  return (
    <main className="h-screen overflow-hidden flex flex-col py-4 px-4 md:py-6 md:pl-20 md:pr-4 relative">
      {/* Animated background gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 md:top-20 right-10 md:right-20 w-64 md:w-96 h-64 md:h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-10 md:bottom-20 left-10 md:left-20 w-64 md:w-96 h-64 md:h-96 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
      </div>

      <div className="max-w-6xl mx-auto w-full flex flex-col h-full relative z-10">
        {/* Hero Section - Modern Glassmorphism */}
        <div className="text-center mb-4 md:mb-6 animate-in fade-in slide-in-from-top-2">
          <div className="inline-flex items-center justify-center gap-2 mb-2 md:mb-3 glass-strong px-4 md:px-6 py-2 md:py-3 rounded-2xl hover-lift glow-primary">
            <Sparkles className="w-5 md:w-6 h-5 md:h-6 text-primary animate-pulse-glow" />
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-primary-light via-primary to-accent bg-clip-text text-transparent">
              RAG Challenge Demo
            </h1>
          </div>
          <p className="text-xs md:text-sm text-gray-400 mb-3 md:mb-4 font-light px-4">
            Semantische Suche mit Retrieval-Augmented Generation
          </p>
          
          {/* Tech Stack Badges - Modern */}
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 text-xs px-4">
            <div className="group flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 glass rounded-full hover:glass-strong transition-all duration-300 hover-lift">
              <Zap className="w-3 md:w-4 h-3 md:h-4 text-primary-light group-hover:animate-pulse" />
              <span className="font-semibold text-gray-200">Next.js 15 + React 19</span>
            </div>
            <div className="group flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 glass rounded-full hover:glass-strong transition-all duration-300 hover-lift">
              <Database className="w-3 md:w-4 h-3 md:h-4 text-green-400 group-hover:animate-pulse" />
              <span className="font-semibold text-gray-200">Supabase + pgvector</span>
            </div>
            <div className="group flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 glass rounded-full hover:glass-strong transition-all duration-300 hover-lift">
              <Sparkles className="w-3 md:w-4 h-3 md:h-4 text-accent-light group-hover:animate-pulse" />
              <span className="font-semibold text-gray-200">Vercel AI SDK</span>
            </div>
          </div>
        </div>

        {/* Chat Interface - Modern Card */}
        <div className="flex-1 min-h-0 mb-4 animate-in fade-in slide-in-from-bottom-2" style={{ animationDelay: '100ms' }}>
          <ChatWindowWithHistory />
        </div>

        {/* Features Section - Glassmorphism Cards */}
        <div className="hidden md:grid md:grid-cols-3 gap-4 text-center animate-in fade-in slide-in-from-bottom-2" style={{ animationDelay: '200ms' }}>
          <div className="group glass hover:glass-strong p-4 rounded-xl transition-all duration-300 hover-lift border border-primary/20">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Database className="w-5 h-5 text-primary-light group-hover:scale-110 transition-transform duration-300" />
              <h3 className="text-sm font-semibold text-gray-200">Vector Search</h3>
            </div>
            <p className="text-xs text-gray-500">Semantische Suche in der Wissensdatenbank</p>
          </div>
          
          <div className="group glass hover:glass-strong p-4 rounded-xl transition-all duration-300 hover-lift border border-green-500/20">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Zap className="w-5 h-5 text-green-400 group-hover:scale-110 transition-transform duration-300" />
              <h3 className="text-sm font-semibold text-gray-200">Real-time Streaming</h3>
            </div>
            <p className="text-xs text-gray-500">Live-Antworten durch Streaming API</p>
          </div>
          
          <div className="group glass hover:glass-strong p-4 rounded-xl transition-all duration-300 hover-lift border border-accent/20">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Sparkles className="w-5 h-5 text-accent-light group-hover:scale-110 transition-transform duration-300" />
              <h3 className="text-sm font-semibold text-gray-200">React 19 Features</h3>
            </div>
            <p className="text-xs text-gray-500">Modernste React-Technologien</p>
          </div>
        </div>
      </div>
    </main>
  )
}
