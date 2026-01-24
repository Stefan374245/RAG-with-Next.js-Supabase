# 🚀 RAG AI System - Next.js 15 & React 19

Advanced Retrieval-Augmented Generation (RAG) System with Full Chat History Management. Built with Next.js 15, React 19, Supabase, and OpenAI.

## 🎯 Project Overview

A production-ready RAG system featuring:
- **Real-time Streaming Chat** - Live AI responses with source citations
- **Persistent Chat History** - Session management with localStorage fallback
- **Semantic Vector Search** - Fast similarity search with pgvector
- **Modern React Architecture** - React 19 + Compiler + Server Components
- **Clean UI/UX** - Responsive design with dropdown and sidebar history views

## 🏗️ Architektur

```
┌─────────────────────────────────────────────────────────┐
│  Next.js 15 Frontend (React 19 + Compiler)              │
│  - Server Components                                    │
│  - Client Components mit useChat Hook                   │
│  - Server Actions für Ingestion                         │
└─────────────────────────────────────────────────────────┘
                          │
                          │ HTTP / Streaming
                          ↓
┌─────────────────────────────────────────────────────────┐
│  API Routes (Edge Runtime)                              │
│  /api/chat - RAG Orchestration + LLM Streaming          │
└─────────────────────────────────────────────────────────┘
                          │
                          ↓
┌───────────────────┐   ┌────────────────────────────┐
│  Supabase         │   │  OpenAI API                │
│  - Postgres       │   │  - text-embedding-3-small  │
│  - pgvector       │   │  - gpt-4-turbo             │
│  - RPC Functions  │   └────────────────────────────┘
└───────────────────┘
```

### RAG-Workflow

1. **Retrieval**: User-Query → Embedding-Generierung → Vector-Similarity-Search (Supabase RPC)
2. **Augmentation**: Top-5-Dokumente → System-Prompt-Injection mit Context
3. **Generation**: Augmented-Prompt → OpenAI GPT-4 → Server-Sent Events (SSE) Streaming

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router, React 19, React Compiler)
- **AI SDK**: Vercel AI SDK 3.0+ (`streamText`, `useChat`)
- **Database**: Supabase Postgres + pgvector
- **LLM**: OpenAI (Embeddings + Chat)
- **Styling**: Tailwind CSS + lucide-react
- **Type-Safety**: TypeScript (Strict Mode, kein `any`)

## 📦 Project Structure (Feature-Based Architecture)

```
/
├── app/
│   ├── api/chat/route.ts          # 🔥 Streaming RAG endpoint
│   ├── actions/
│   │   ├── ingest.action.ts       # Document ingestion
│   │   └── seed.action.ts         # Knowledge base seeding
│   ├── admin/page.tsx             # Admin panel
│   ├── layout.tsx
│   └── page.tsx
├── features/rag-chat/              # Main RAG feature module
│   ├── components/
│   │   ├── chat-window-with-history.tsx   # Main chat component
│   │   ├── chat-history-dropdown.tsx      # Header history dropdown
│   │   ├── chat-history-sidebar.tsx       # Sidebar history view
│   │   ├── compact-sidebar.tsx            # Mini sidebar navigation
│   │   ├── system-info-overlay.tsx        # System info modal
│   │   ├── chat-input.tsx                 # Message input
│   │   ├── message-bubble.tsx             # Chat messages
│   │   └── source-list.tsx                # Source citations
│   ├── services/
│   │   ├── chat-history-service.ts        # 🔥 History management
│   │   ├── vector-service.ts              # Vector search
│   │   └── llm-service.ts                 # LLM orchestration
│   └── types.ts
├── components/ui/                  # Reusable UI components
├── lib/                            # Shared utilities
│   ├── supabase.ts
│   ├── openai.ts
│   └── utils.ts
└── supabase/
    ├── migrations/
    │   └── 20260124_init_schema.sql
    └── seed.sql
```

## 🚀 Setup & Installation

### 1. Projekt klonen

```bash
git clone <repo-url>
cd "RAG AI"
npm install
```

### 2. Supabase Setup

1. Erstelle ein neues Projekt auf [supabase.com](https://supabase.com)
2. Führe das SQL-Schema aus:
   ```bash
   # In Supabase SQL Editor:
   # Kopiere Inhalt von supabase/migrations/20260124_init_schema.sql
   ```
3. Optional: Seed-Daten einspielen (supabase/seed.sql)

### 3. Environment Variables

```bash
cp .env.local.example .env.local
```

Füge deine Keys ein:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

# OpenAI
OPENAI_API_KEY=sk-xxx...
```

**Keys finden:**
- Supabase: Project Settings → API → URL + anon key + service_role key
- OpenAI: [platform.openai.com/api-keys](https://platform.openai.com/api-keys)

### 4. Entwicklungsserver starten

```bash
npm run dev
```

Öffne [http://localhost:3000](http://localhost:3000)

## 🎨 Features

### ✅ Core RAG System

- **Semantic Search**: pgvector HNSW-Index for fast cosine similarity search
- **Real-time Streaming**: LLM responses streamed live via SSE
- **Source Citations**: Display retrieved documents with relevance scores
- **Context Injection**: Top-5 documents automatically added to prompts
- **Error Handling**: Comprehensive error boundaries for robust UX

### 🆕 Chat History Management

- **Persistent Sessions**: All conversations saved with unique session IDs
- **Dropdown History**: Quick access to recent chats from header
- **Sidebar View**: Full history management in dedicated sidebar
- **Session Switching**: Load any previous conversation with one click
- **Message Tracking**: Complete message history with timestamps
- **LocalStorage Fallback**: Works without database for development
- **Delete Sessions**: Clean up old conversations

### 🎯 React 19 & Modern Patterns

- **React Compiler**: Auto-memoization for optimal performance
- **Server Components**: Reduced bundle size and faster initial load
- **Server Actions**: Type-safe API calls without boilerplate
- **useChat Hook**: Vercel AI SDK for seamless chat state management
- **Streaming UI**: Progressive rendering of AI responses

### 💅 UI/UX

- **Responsive Design**: Mobile-first with adaptive layouts
- **Dark Theme Header**: Professional gradient design
- **Backdrop Modals**: Clean dropdown interactions
- **Smooth Animations**: Fade-in/slide-in transitions
- **Loading States**: Spinners and skeleton screens
- **Compact Sidebar**: Minimal navigation with icons

### 📊 Performance

- **Vector Search**: < 100ms (5 Results, HNSW Index)
- **Embedding Generation**: < 200ms (OpenAI API)
- **Stream-Start**: < 400ms (RAG Pipeline Total)
- **Lighthouse Score**: 90+ (alle Kategorien)

## 🧪 Usage

### Main Chat Interface

1. **Ask Questions**: Type your question about React, Next.js, or RAG systems
2. **Semantic Search**: System searches knowledge base using vector similarity
3. **Context Injection**: Top-5 relevant documents added to prompt
4. **Live Streaming**: GPT-4 response streams in real-time
5. **View Sources**: See which documents were used with relevance scores

### Chat History Management

**Via Dropdown (Header)**:
- Click "Verlauf" button in header
- See all previous chat sessions
- Click any session to load it
- Click "Neuer Chat" to start fresh
- Delete icon to remove sessions

**Via Sidebar**:
- Open sidebar from compact navigation
- Browse full chat history
- Load or delete sessions
- See message counts and timestamps

### System Info

- Click info icon in compact sidebar
- View system architecture
- See tech stack details
- Understand RAG workflow

### Adding Documents (Admin)

Navigate to `/admin` to seed the knowledge base with default documents, or use the Server Action:

```typescript
import { ingestDocument } from '@/app/actions/ingest.action'

await ingestDocument(
  'Document Title',
  'Long document content here...',
  { category: 'docs', source: 'manual' }
)
```

The system automatically:
1. Chunks text (512 chars, 50 overlap)
2. Generates embeddings for each chunk
3. Stores in Supabase with pgvector

## 🏛️ Design Decisions

### 1. Chat History Architecture

**Dual Storage Strategy:**
- **Primary**: Supabase for production persistence
- **Fallback**: localStorage for development/offline mode
- **Service Pattern**: `ChatHistoryService` abstracts storage layer

**Why this approach?**
- Zero-config development experience
- Graceful degradation without database
- Easy to extend with additional storage backends
- Type-safe interfaces throughout

### 2. Vercel AI SDK vs Direct OpenAI

- **Streaming Abstraction**: `streamText()` handles SSE complexity automatically
- **Provider Agnostic**: Switch to Anthropic/Cohere without frontend changes
- **React Integration**: `useChat()` hook provides state management out-of-the-box
- **Better DX**: Simplified error handling and retry logic

### 3. Feature-Based Architecture

- **Scalability**: Each feature is isolated (e.g., `rag-chat` could become npm package)
- **Co-Location**: Services, components, and types live together
- **Clear Boundaries**: Easy to understand and maintain
- **Team-Friendly**: Multiple developers can work on different features

### 4. Dropdown vs Sidebar History

**Both Included Because:**
- **Dropdown**: Quick access without leaving chat (desktop workflow)
- **Sidebar**: Full history management for power users
- **Mobile-First**: Dropdown works better on small screens
- **Flexibility**: Users choose their preferred workflow

### 5. Session Management

**Why Session IDs?**
- Enable chat history without user authentication
- Simple UUID-based identification
- Easy to extend with user accounts later
- Works offline with localStorage

### 6. Event Handling Solution

**Problem**: Nested buttons or click propagation issues
**Solution**: 
- Backdrop overlay with z-index layering
- Proper event stopping in delete buttons
- onMouseDown for better responsiveness
- Data attributes for selective event handling

## 🚢 Deployment

### Vercel (Empfohlen)

```bash
# Push zu Git
git push origin main

# In Vercel:
# 1. Import Repository
# 2. Environment-Variables setzen (siehe .env.local.example)
# 3. Deploy
```

**Wichtig**: Edge Runtime für `/api/chat` benötigt Vercel Pro oder höher bei großem Traffic.

### Alternative: Selbst-Hosting

```bash
npm run build
npm start
```

Requirements:
- Node.js 20+
- Environment-Variables gesetzt
- Supabase-Zugriff

## 📝 Development Timeline

### Phase 1: Foundation (Completed)
- ✅ Next.js 15 + React 19 setup
- ✅ Supabase integration with pgvector
- ✅ OpenAI embeddings and chat
- ✅ Basic RAG pipeline

### Phase 2: Core Features (Completed)
- ✅ Streaming chat interface
- ✅ Vector search implementation
- ✅ Source citations
- ✅ Server Actions for document ingestion
- ✅ Admin panel for seeding

### Phase 3: History Management (Completed)
- ✅ Chat history service with dual storage
- ✅ Session management system
- ✅ History dropdown component
- ✅ Full sidebar history view
- ✅ Session loading and deletion
- ✅ Timestamp and message tracking

### Phase 4: Polish & UX (Completed)
- ✅ Responsive design improvements
- ✅ System info overlay
- ✅ Compact sidebar navigation
- ✅ Error boundary components
- ✅ Loading states and animations
- ✅ Fixed event handling issues
- ✅ Optimized state synchronization

**Total Development Time**: ~6-8 hours

## 🐛 Troubleshooting

### Chat History Issues

**Sessions not loading:**
- Check browser console for errors
- Verify Supabase connection (falls back to localStorage)
- Try clearing localStorage: `localStorage.clear()` in console

**Dropdown not closing on click:**
- This was a known issue - now fixed with backdrop overlay
- Ensure you're on latest version

**Messages not displaying after load:**
- Fixed with proper state synchronization
- Uses `requestAnimationFrame` for UI updates

### General Issues

**"Missing Supabase environment variables"**
- Ensure `.env.local` exists with all required keys
- No spaces or quotes around values
- Restart dev server after changes

**"Failed to generate embedding"**
- Verify OpenAI API key is valid
- Check quota limits at [platform.openai.com/usage](https://platform.openai.com/usage)
- Ensure billing is set up on OpenAI account

**"Supabase RPC error"**
- Confirm SQL migration was executed
- Verify pgvector extension: `CREATE EXTENSION vector`
- Check Supabase logs in dashboard

**"Chat doesn't stream"**
- Edge Runtime works better in production
- For local dev: `npm run build && npm start`
- Check network tab for SSE connection

## 📚 Weitere Ressourcen

- [Next.js 15 Docs](https://nextjs.org/docs)
- [Vercel AI SDK](https://sdk.vercel.ai/docs)
- [Supabase Vector Guide](https://supabase.com/docs/guides/ai)
- [React 19 Release Notes](https://react.dev/blog/2024/12/05/react-19)

## 🙏 Acknowledgments

- **Vercel** für AI SDK und Hosting-Plattform
- **Supabase** für Postgres + pgvector
- **OpenAI** für Embeddings und GPT-4
- **React Team** für React 19 und Compiler

## 🚀 Future Enhancements

### Planned Features

- [ ] **User Authentication**: Multi-user support with Supabase Auth
- [ ] **Shared Sessions**: Share chat links with others
- [ ] **Export Chats**: Download conversations as PDF/Markdown
- [ ] **Advanced Search**: Full-text search across chat history
- [ ] **Chat Folders**: Organize conversations by topic
- [ ] **Collaborative Editing**: Multiple users in same session
- [ ] **Voice Input**: Speech-to-text integration
- [ ] **Custom Models**: Support for different LLM providers
- [ ] **Analytics Dashboard**: Usage statistics and insights
- [ ] **API Access**: RESTful API for programmatic access

### Performance Optimizations

- [ ] Implement chat pagination for large histories
- [ ] Add Redis caching for frequent queries
- [ ] Optimize vector search with better indexing
- [ ] Implement message chunking for long conversations
- [ ] Add background workers for embedding generation

---

**Built with ❤️ as a showcase of modern RAG architecture**
