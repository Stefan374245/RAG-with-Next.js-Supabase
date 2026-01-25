import { ChatWindowWithHistory } from '../features/rag-chat/components/chat-window-with-history'
import { Code2, BookOpen, Lightbulb, Zap, Layers, Terminal } from 'lucide-react'

export default function TechStackAdvisorHome() {
  return (
    <main className="h-screen overflow-hidden flex flex-col py-4 px-4 md:py-6 md:pl-20 md:pr-4 relative">
      {/* Animated background gradients - Tech Theme */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 md:top-20 right-10 md:right-20 w-64 md:w-96 h-64 md:h-96 bg-blue-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-10 md:bottom-20 left-10 md:left-20 w-64 md:w-96 h-64 md:h-96 bg-purple-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto w-full flex flex-col h-full relative z-10">
        {/* Hero Section - TechStack Advisor Branding */}
        <div className="text-center mb-4 md:mb-6 animate-in fade-in slide-in-from-top-2">
          <div className="inline-flex items-center justify-center gap-2 mb-2 md:mb-3 glass-strong px-4 md:px-6 py-2 md:py-3 rounded-2xl hover-lift">
            <Terminal className="w-5 md:w-6 h-5 md:h-6 text-blue-400 animate-pulse-glow" />
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-400 via-violet-400 to-purple-500 bg-clip-text text-transparent">
              TechStack Advisor
            </h1>
            <Code2 className="w-5 md:w-6 h-5 md:h-6 text-purple-400" />
          </div>
          <p className="text-xs md:text-sm text-gray-400 mb-3 md:mb-4 font-light px-4">
            Your AI-Powered Developer Knowledge Hub 💻 | JavaScript, Angular, React, Next.js
          </p>
          
          {/* Quick Filter Tags - Tech Topics */}
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 text-xs px-4 mb-3">
            <div className="group flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 glass rounded-full hover:glass-strong transition-all duration-300 hover-lift hover:border-blue-400/50 border border-transparent">
              <Code2 className="w-3 h-3 text-blue-400 group-hover:animate-pulse" />
              <span className="font-semibold text-gray-200">50+ Frameworks</span>
            </div>
            <div className="group flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 glass rounded-full hover:glass-strong transition-all duration-300 hover-lift hover:border-violet-400/50 border border-transparent">
              <Layers className="w-3 h-3 text-violet-400 group-hover:animate-pulse" />
              <span className="font-semibold text-gray-200">Code Patterns</span>
            </div>
            <div className="group flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 glass rounded-full hover:glass-strong transition-all duration-300 hover-lift hover:border-purple-400/50 border border-transparent">
              <BookOpen className="w-3 h-3 text-purple-400 group-hover:animate-pulse" />
              <span className="font-semibold text-gray-200">Best Practices</span>
            </div>
            <div className="group flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 glass rounded-full hover:glass-strong transition-all duration-300 hover-lift hover:border-pink-400/50 border border-transparent">
              <Zap className="w-3 h-3 text-pink-400 group-hover:animate-pulse" />
              <span className="font-semibold text-gray-200">Error Solutions</span>
            </div>
          </div>

          {/* Example Questions - Developer Focus */}
          <div className="flex flex-wrap justify-center gap-2 text-xs px-4">
            <button className="glass px-3 py-1.5 rounded-full hover-lift transition-all hover:bg-blue-500/10 hover:border-blue-400/30 border border-transparent">
              ⚛️ "Was sind React Hooks und wie benutze ich sie?"
            </button>
            <button className="glass px-3 py-1.5 rounded-full hover-lift transition-all hover:bg-violet-500/10 hover:border-violet-400/30 border border-transparent">
              🔷 "Unterschied zwischen Angular und React?"
            </button>
            <button className="glass px-3 py-1.5 rounded-full hover-lift transition-all hover:bg-purple-500/10 hover:border-purple-400/30 border border-transparent">
              ▲ "Next.js Server Components vs Client Components?"
            </button>
            <button className="glass px-3 py-1.5 rounded-full hover-lift transition-all hover:bg-pink-500/10 hover:border-pink-400/30 border border-transparent">
              💡 "Erkläre mir JavaScript Closures!"
            </button>
          </div>
        </div>

        {/* Chat Interface - Modern Card */}
        <div className="flex-1 min-h-0 mb-4 animate-in fade-in slide-in-from-bottom-2" style={{ animationDelay: '100ms' }}>
          <ChatWindowWithHistory />
        </div>

        {/* Features Section - TechStack Stats */}
        <div className="hidden md:grid md:grid-cols-4 gap-3 text-center animate-in fade-in slide-in-from-bottom-2" style={{ animationDelay: '200ms' }}>
          <div className="group glass hover:glass-strong p-3 rounded-xl transition-all duration-300 hover-lift border border-blue-500/20">
            <div className="text-2xl font-bold text-blue-400 mb-1 group-hover:scale-110 transition-transform">50+</div>
            <div className="text-xs text-gray-400">Frameworks</div>
          </div>
          
          <div className="group glass hover:glass-strong p-3 rounded-xl transition-all duration-300 hover-lift border border-violet-500/20">
            <div className="text-2xl font-bold text-violet-400 mb-1 group-hover:scale-110 transition-transform">100+</div>
            <div className="text-xs text-gray-400">Code Patterns</div>
          </div>
          
          <div className="group glass hover:glass-strong p-3 rounded-xl transition-all duration-300 hover-lift border border-purple-500/20">
            <div className="text-2xl font-bold text-purple-400 mb-1 group-hover:scale-110 transition-transform">200+</div>
            <div className="text-xs text-gray-400">Solutions</div>
          </div>
          
          <div className="group glass hover:glass-strong p-3 rounded-xl transition-all duration-300 hover-lift border border-pink-500/20">
            <div className="text-2xl font-bold text-pink-400 mb-1 group-hover:scale-110 transition-transform">24/7</div>
            <div className="text-xs text-gray-400">AI Assistant</div>
          </div>
        </div>
      </div>
    </main>
  )
}
