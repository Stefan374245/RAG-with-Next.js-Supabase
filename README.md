# 🤖 TechStack Advisor - Intelligent Developer Documentation Assistant

> Ein produktionsreifes **Retrieval-Augmented Generation (RAG)** System, das Entwicklern präzise, quellenbasierte Antworten auf technische Fragen liefert.

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)](https://supabase.com/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4-purple)](https://openai.com/)

---

## 📖 Was ist TechStack Advisor?

**TechStack Advisor** ist ein KI-gestützter Assistent, der speziell für Entwickler entwickelt wurde. Statt allgemeines Wissen zu nutzen, durchsucht das System eine **eigene Wissensdatenbank** mit technischer Dokumentation und liefert **präzise, quellenbasierte Antworten**.

### 🎯 Kernfunktionen

✅ **RAG-basierte Antworten** - Nutzt NUR Informationen aus der Wissensdatenbank, kein Halluzinieren  
✅ **Semantische Suche** - Findet relevante Dokumente durch Vektorähnlichkeit (pgvector)  
✅ **Live-Streaming** - Antworten werden in Echtzeit gestreamt  
✅ **Quellenangaben** - Zeigt verwendete Dokumente mit Relevanz-Scores  
✅ **Chat-Historie** - Alle Gespräche werden gespeichert und können wiederhergestellt werden  
✅ **Modern Stack** - Next.js 15, React 19, TypeScript, Supabase, OpenAI  

---

## 🚀 Wie funktioniert es?

### RAG-Pipeline in 3 Schritten

```
┌─────────────────────────────────────────────────────────────────┐
│  1. RETRIEVAL (Abrufen)                                         │
│  ─────────────────────────────────────────────────────────────  │
│  User-Frage → Embedding generieren → Vector Search              │
│  "Erkläre mir Angular" → [0.032, -0.009, ...] → Top 5 Docs     │
└─────────────────────────────────────────────────────────────────┘
                            │
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│  2. AUGMENTATION (Anreichern)                                   │
│  ─────────────────────────────────────────────────────────────  │
│  Gefundene Dokumente → System-Prompt injizieren                 │
│  [Angular Components, Services...] → Kontext für LLM           │
└─────────────────────────────────────────────────────────────────┘
                            │
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│  3. GENERATION (Generieren)                                     │
│  ─────────────────────────────────────────────────────────────  │
│  Angereicherter Prompt → GPT-4 → Streaming Response             │
│  System + User Query → LLM → "Angular ist..." + Quellen [1][2] │
└─────────────────────────────────────────────────────────────────┘
```

### 🔍 Detaillierter Workflow

1. **User stellt Frage:** "Erkläre mir Angular Components"
   
2. **Embedding-Generierung:**
   - OpenAI `text-embedding-3-small` erstellt 1536-dimensionalen Vektor
   - Query wird in mathematische Repräsentation umgewandelt

3. **Vektor-Suche (Supabase):**
   - PostgreSQL mit pgvector Extension
   - HNSW-Index für schnelle Cosine-Similarity-Suche
   - Top 5 ähnlichste Dokumente werden abgerufen (Threshold: 30%)

4. **Kontext-Injektion:**
   - Gefundene Dokumente werden in System-Prompt eingefügt
   - LLM bekommt strikte Anweisung: **"Nutze NUR diese Dokumente!"**

5. **LLM-Generierung:**
   - GPT-4 Turbo generiert Antwort basierend auf Kontext
   - Temperature: 0.3 (sehr faktisch, wenig kreativ)
   - Streaming via Server-Sent Events (SSE)

6. **Response mit Quellen:**
   - User sieht Antwort + Quellenangaben [1], [2]
   - Kann Dokumente mit Relevanz-Scores einsehen

---

## 🏗️ System-Architektur

```
┌────────────────────────────────────────────────────────────────┐
│                    FRONTEND (React 19)                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │ ChatWindow   │  │ SourceList   │  │ History      │        │
│  │ (useChat)    │  │ (Citations)  │  │ (Sessions)   │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
└────────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP / SSE
                            ↓
┌────────────────────────────────────────────────────────────────┐
│                  API LAYER (Edge Runtime)                      │
│  /api/chat          - RAG Orchestration + Streaming            │
│  /api/db-health     - Database Health Check                    │
│  /api/test-rag      - Integration Testing                      │
│  /api/debug-prompt  - Prompt Inspection                        │
└────────────────────────────────────────────────────────────────┘
                            │
                ┌───────────┴────────────┐
                ↓                        ↓
┌──────────────────────────┐   ┌──────────────────────┐
│   SUPABASE POSTGRES      │   │   OPENAI API         │
│   ├── knowledge_base     │   │   ├── Embeddings     │
│   │   ├── title         │   │   │   (1536-dim)      │
│   │   ├── content       │   │   └── GPT-4 Turbo    │
│   │   ├── embedding     │   │       (streaming)     │
│   │   └── metadata      │   └──────────────────────┘
│   ├── chat_history      │
│   └── pgvector + HNSW   │
└──────────────────────────┘
```

### 📦 Service Layer (Clean Architecture)

```typescript
features/rag-chat/services/
├── vector-service.ts       // Embedding + Vector Search
│   ├── generateEmbedding()
│   ├── searchKnowledge()
│   └── storeDocument()
│
├── llm-service.ts          // Prompt Engineering
│   └── buildRAGPrompt()    // Strenges RAG-Prompt Template
│
└── chat-history-service.ts // Session Management
    ├── saveMessage()
    ├── loadSession()
    └── getAllSessions()
```

---

## 🛠️ Tech Stack

### Core Framework
- **Next.js 15** - App Router, React Server Components, Edge Runtime
- **React 19** - React Compiler für Auto-Memoization
- **TypeScript 5** - Strict Mode, vollständige Type Safety

### AI & Vector Search
- **OpenAI API** - `text-embedding-3-small` (Embeddings), `gpt-4-turbo` (Chat)
- **Vercel AI SDK 3.0** - `streamText()`, `useChat()` Hook
- **Supabase** - PostgreSQL + pgvector Extension für Vector Search
- **HNSW Index** - Hierarchical Navigable Small World für schnelle Similarity Search

### Styling & UI
- **Tailwind CSS** - Utility-First Styling
- **Lucide React** - Icon Library
- **Custom Animations** - Fade-in, Slide-in, Glow Effects

### Development
- **ESLint** - Code Linting
- **TypeScript Strict** - Keine `any` Types
- **Centralized Logger** - Strukturiertes Logging mit Context

---

## 📁 Projekt-Struktur (Feature-Based Architecture)

```
/
├── app/
│   ├── api/
│   │   ├── chat/route.ts              # 🔥 Main RAG Endpoint
│   │   ├── db-health/route.ts         # Database Health Check
│   │   ├── test-rag/route.ts          # RAG Testing Endpoint
│   │   └── debug-prompt/route.ts      # Prompt Debugging
│   ├── actions/
│   │   ├── ingest.action.ts           # Document Ingestion
│   │   └── seed.action.ts             # Knowledge Base Seeding
│   ├── admin/page.tsx                 # Admin Panel
│   ├── layout.tsx                     # Root Layout
│   └── page.tsx                       # Landing Page
│
├── features/rag-chat/                 # 🎯 Main RAG Feature
│   ├── components/
│   │   ├── chat-window.tsx            # Main Chat Interface
│   │   ├── chat-history-dropdown.tsx  # History Dropdown
│   │   ├── chat-history-sidebar.tsx   # Full History View
│   │   ├── message-bubble.tsx         # Message Display
│   │   ├── source-list.tsx            # Citation Display
│   │   ├── chat-input.tsx             # User Input
│   │   └── system-info-overlay.tsx    # System Info Modal
│   ├── services/
│   │   ├── vector-service.ts          # 🔥 Vector Operations
│   │   ├── llm-service.ts             # 🔥 Prompt Engineering
│   │   └── chat-history-service.ts    # History Management
│   └── types.ts                       # Feature Types
│
├── lib/
│   ├── supabase.ts                    # Supabase Client
│   ├── openai.ts                      # OpenAI Configuration
│   ├── constants.ts                   # App Configuration
│   ├── logger.ts                      # 🆕 Centralized Logging
│   └── utils.ts                       # Utilities
│
├── types/
│   └── index.ts                       # Global Type Definitions
│
├── supabase/
│   └── migrations/
│       └── 20260124_init_schema.sql   # Database Schema
│
└── scripts/
    └── seed-knowledge.ts              # Knowledge Base Seeding
```

---

## ⚡ Quick Start

### 1. Installation

```bash
git clone <repo-url>
cd "RAG AI"
npm install
```

### 2. Environment Variables

Erstelle `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...

# OpenAI
OPENAI_API_KEY=sk-proj-...
```

### 3. Datenbank Setup

1. Erstelle Supabase Projekt auf [supabase.com](https://supabase.com)
2. Führe Migration aus: `supabase/migrations/20260124_init_schema.sql`
3. Optional: Seed-Daten laden (siehe Admin Panel)

### 4. Starten

```bash
npm run dev
```

Öffne [http://localhost:3000](http://localhost:3000)

---

## 🎨 Features im Detail

### ✅ RAG-System

**Warum RAG statt direktes LLM?**
- ❌ **Standard LLM:** "Angular wurde 2010 von Google veröffentlicht..." (Halluzination möglich)
- ✅ **RAG System:** "Laut Dokument [1]: Angular Components sind..." (quellenbasiert)

**Vorteile:**
- Präzise Antworten aus eigener Dokumentation
- Keine Halluzinationen bei fehlendem Wissen
- Aktualität durch eigene Datenbank
- Nachvollziehbarkeit durch Quellenangaben

### 🔍 Semantic Search

**Wie funktioniert Vektorsuche?**

```python
# Traditionelle Keyword-Suche
Query: "React Komponenten"
Findet: Nur Dokumente mit exakten Wörtern "React" + "Komponenten"

# Vektor-Suche (Semantic)
Query: "React Komponenten"
Findet auch: "React Components", "Function Components", 
             "Class Components", "JSX Elements"
             
→ Versteht Bedeutung, nicht nur Keywords!
```

**Performance:**
- HNSW-Index: ~100ms für 10.000 Dokumente
- Cosine Similarity: Mathematische Ähnlichkeitsberechnung
- Top-K Retrieval: Nur relevanteste Dokumente

### 💬 Chat-Historie

**Features:**
- Alle Gespräche in Datenbank gespeichert
- Session-basierte Organisation (UUID)
- Dropdown für schnellen Zugriff
- Sidebar für vollständige Historie
- Löschen einzelner Sessions möglich

**Technische Details:**
```typescript
// Session-Struktur
interface ChatSession {
  session_id: string          // UUID
  last_message: string        // Preview
  created_at: string          // Timestamp
  message_count: number       // Anzahl Nachrichten
}

// Message-Struktur
interface ChatMessage {
  id: string
  session_id: string
  message: string
  role: 'user' | 'assistant'
  sources?: KnowledgeItem[]
  created_at: string
}
```

### 📊 Debug-Endpunkte

```bash
# 1. RAG-Pipeline testen
GET /api/test-rag?q=Angular
→ Zeigt Embeddings, RPC-Call, gefundene Dokumente

# 2. Prompt inspizieren
GET /api/debug-prompt?q=React
→ Zeigt exakten System-Prompt den das LLM erhält

# 3. Datenbank-Status
GET /api/db-health
→ Prüft Tabellen, Embeddings, RPC-Funktionen
```

---

## 🚀 Deployment

### Vercel (Empfohlen)

**1. Repository verbinden**
```bash
git push origin main
```

**2. In Vercel:**
- Import Repository
- Framework: Next.js (auto-detected)
- Root Directory: `.`

**3. Environment Variables setzen:**

Alle Variablen aus `.env.local` in Vercel Project Settings → Environment Variables übertragen.

**4. Deploy:**
- Click "Deploy"
- Vercel erstellt automatisch URL: `https://xxx.vercel.app`

### ✅ Production Checklist

- [x] Environment Variables gesetzt
- [x] Supabase Projekt produktionsbereit
- [x] OpenAI API-Key mit ausreichend Credits
- [x] Knowledge Base mit Dokumenten gefüllt
- [x] Build lokal getestet (`npm run build`)
- [x] CORS/Headers konfiguriert (falls nötig)

### 📊 Monitoring

Nach Deployment prüfen:
- Vercel Analytics aktiviert
- Error Tracking (Sentry optional)
- Database Metrics in Supabase
- OpenAI Usage Dashboard

**Logs ansehen:**
```
Vercel Dashboard → Deployments → [Latest] → Runtime Logs
```

---

## 🔧 Configuration

### RAG-Parameter anpassen

`lib/constants.ts`:

```typescript
export const APP_CONFIG = {
  // Ähnlichkeits-Schwellenwert (höher = strenger)
  MATCH_THRESHOLD: 0.3,    // 30% Minimum
  
  // Anzahl Dokumente pro Query
  MATCH_COUNT: 5,          // Top 5
  
  // LLM Temperature (0 = faktisch, 1 = kreativ)
  TEMPERATURE: 0.3,        // Sehr faktisch
  
  // Max Response Länge
  MAX_TOKENS: 1000,
  
  // Document Chunking
  CHUNK_SIZE: 512,         // Token pro Chunk
  CHUNK_OVERLAP: 50,       // Overlap für Kontext
}
```

### Prompt-Engineering

`features/rag-chat/services/llm-service.ts`:

```typescript
// Verschärfung des Prompts
return `Du bist TechStack Advisor.

⛔ ABSOLUTE REGELN:
1. Nutze AUSSCHLIESSLICH die folgenden Dokumente
2. IGNORIERE dein vortrainiertes Wissen
3. Bei fehlenden Infos: Sage das klar

📚 DOKUMENTE:
${context}

❓ FRAGE: ${userQuery}
💬 ANTWORT (NUR aus den Dokumenten!):`
```

---

## 🧪 Testing

### Unit Tests (Empfohlen)

```bash
npm install -D vitest @testing-library/react
```

```typescript
// vector-service.test.ts
describe('generateEmbedding', () => {
  it('should return 1536-dimensional vector', async () => {
    const embedding = await generateEmbedding('test')
    expect(embedding).toHaveLength(1536)
  })
})
```

### Integration Tests

```bash
# RAG-Pipeline Ende-zu-Ende
curl http://localhost:3000/api/test-rag?q=React

# Database Health
curl http://localhost:3000/api/db-health

# Prompt Inspection
curl http://localhost:3000/api/debug-prompt?q=Angular
```

### E2E Tests (Playwright)

```bash
npm install -D @playwright/test
```

```typescript
test('RAG workflow', async ({ page }) => {
  await page.goto('http://localhost:3000')
  await page.fill('textarea', 'Erkläre mir React')
  await page.click('button[type="submit"]')
  await expect(page.locator('.message-bubble')).toContainText('React')
  await expect(page.locator('.source-list')).toBeVisible()
})
```

---

## 🐛 Troubleshooting

### Häufige Probleme

**1. "No sources found"**
```bash
# Prüfen ob Dokumente vorhanden
curl http://localhost:3000/api/db-health

# Threshold zu hoch?
# → In constants.ts MATCH_THRESHOLD von 0.3 auf 0.2 senken
```

**2. "Supabase RPC error"**
```sql
-- In Supabase SQL Editor prüfen:
SELECT * FROM knowledge_base LIMIT 1;

-- Extension installiert?
CREATE EXTENSION IF NOT EXISTS vector;
```

**3. "Streaming doesn't work"**
```bash
# Edge Runtime Problem?
# → npm run build && npm start (Production Mode testen)

# Network Tab prüfen: SSE-Verbindung sichtbar?
```

**4. "Chat History not saving"**
```typescript
// Browser Console:
localStorage.getItem('chat-sessions')
// → Sollte JSON mit Sessions zeigen

// Supabase prüfen:
SELECT * FROM chat_history ORDER BY created_at DESC LIMIT 10;
```

---

## 📚 Weiterführende Ressourcen

### Dokumentation
- [RAG Best Practices](https://www.anthropic.com/index/retrieval-augmented-generation)
- [pgvector Guide](https://github.com/pgvector/pgvector)
- [Vercel AI SDK Docs](https://sdk.vercel.ai/docs)
- [Next.js 15 Documentation](https://nextjs.org/docs)

### Tutorials
- [Building Production RAG](https://www.pinecone.io/learn/retrieval-augmented-generation/)
- [Vector Search Explained](https://www.youtube.com/watch?v=klTvEwg3oJ4)
- [React 19 Features](https://react.dev/blog/2024/12/05/react-19)

---

## 🎯 Best Practices

### Clean Code
✅ Feature-based Architecture  
✅ Service Layer Pattern  
✅ Centralized Logging  
✅ Type Safety (no `any`)  
✅ Error Boundaries  

### Performance
✅ React Compiler (Auto-Memoization)  
✅ Server Components  
✅ Edge Runtime  
✅ Vector Indexing (HNSW)  
✅ Streaming Responses  

### Security
✅ Environment Variables  
✅ Input Validation  
✅ Error Message Sanitization  
✅ Rate Limiting (TODO)  
✅ Authentication (TODO)  

---

## 🚀 Roadmap

### v2.0 (Planned)
- [ ] Multi-User Support (Supabase Auth)
- [ ] Advanced Analytics Dashboard
- [ ] Document Upload via UI
- [ ] Custom Embedding Models
- [ ] Hybrid Search (Vector + Keyword)
- [ ] Chat Export (PDF/Markdown)
- [ ] API Authentication
- [ ] Rate Limiting
- [ ] Caching Layer (Redis)

### v3.0 (Future)
- [ ] Multi-Language Support
- [ ] Voice Input/Output
- [ ] Collaborative Chats
- [ ] Plugin System
- [ ] Mobile App

---

## 📄 License

MIT License - siehe [LICENSE](LICENSE)

---

## 🙏 Acknowledgments

Dieses Projekt wurde entwickelt mit:
- **Vercel** - AI SDK & Hosting
- **Supabase** - PostgreSQL + pgvector
- **OpenAI** - GPT-4 & Embeddings
- **React Team** - React 19 & Compiler

---

## 📧 Support

Bei Fragen oder Problemen:
- 📖 Lies die [Dokumentation](#-wie-funktioniert-es)
- 🐛 Check [Troubleshooting](#-troubleshooting)
- 💬 Öffne ein Issue auf GitHub

---

**Built with ❤️ for Developers**

⭐ **Star this repo** if you find it helpful!
