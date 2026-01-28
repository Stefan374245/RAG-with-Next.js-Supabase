
# 🤖 TechStack Advisor – RAG Challenge mit Next.js & Supabase

TechStack Advisor ist ein modernes Retrieval-Augmented-Generation (RAG) System, das Entwicklerfragen auf Basis einer eigenen Wissensdatenbank beantwortet. Es kombiniert Next.js (Frontend & API) mit Supabase (Postgres + pgvector) für semantische Suche und persistente Speicherung. Die Antworten des LLMs basieren ausschließlich auf den gefundenen Dokumenten – mit transparenter Quellenangabe und nachvollziehbarem Logging.

## Architektur
1. User stellt Frage im Web-UI (Next.js/React)
2. API-Route erzeugt ein Embedding und sucht in Supabase nach ähnlichen Dokumenten
3. Die gefundenen Dokumente werden als Kontext an das LLM gegeben
4. Das LLM generiert eine Antwort ausschließlich aus diesen Quellen
5. Antwort & Quellen werden im UI angezeigt

## Setup & Start
1. **Supabase-Projekt anlegen** und pgvector-Erweiterung aktivieren
2. **Migrationen ausführen:**
  - `supabase/migrations/20260124_init_schema.sql`
3. **Wissensdatenbank befüllen:**
  - `npm run seed:tech` (führt `scripts/seed-knowledge.ts` aus)
4. **Umgebungsvariablen setzen:** `.env.local` mit Supabase- und OpenAI-Keys
5. **App starten:**
  - `npm install`
  - `npm run dev`

## Design-Entscheidungen
- **Trennung von Infrastruktur (lib/) und Business-Logik (services/)**
- **Klares Prompt-Design:** LLM darf nur aus echten Dokumenten antworten
- **Erweiterbar:** Multi-Tenant, weitere Dokumente, andere LLMs möglich

## Demo
- Fragebeispiele: "Was ist ein React Server Component?", "Wie funktioniert die Vektorsuche?"
- Quellenangaben werden im Chat angezeigt


---

## 🧩 Chunking-Logik: splitTextIntoChunks

Um lange Texte effizient für die semantische Suche vorzubereiten, nutzt das System eine eigene Chunking-Funktion:

- **splitTextIntoChunks** teilt große Texte in überlappende Abschnitte (Chunks), z.B. 512 Wörter pro Chunk mit 50 Wörtern Überlappung (Standardwerte).
- Die Chunk-Größe und Überlappung sind konfigurierbar (siehe `APP_CONFIG` in `lib/constants.ts`).
- Die Funktion approximiert Token durch Wörter – das ist für OpenAI-Embeddings ausreichend genau.
- Vorteil: Auch längere Dokumente werden vollständig und mit Kontextabdeckung indiziert, ohne dass relevante Informationen an Chunk-Grenzen verloren gehen.
- Die Chunks werden als einzelne Einträge in der Vektordatenbank gespeichert und bei der Suche als Kontext für das LLM verwendet.

**Beispiel:**

```ts
import { splitTextIntoChunks } from './lib/utils';

const text = '...langer Text...';
const chunks = splitTextIntoChunks(text, 512, 50);
// → Gibt ein Array von Strings zurück, jeder String ist ein Chunk
```

---

**Challenge umgesetzt von:**
[Stefan Helldobler](https://stefan-helldobler.de/portfolio/) | [https://github.com/Stefan374245/RAG-with-Next.js-Supabase]

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
