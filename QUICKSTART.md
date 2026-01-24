# RAG Challenge - Quick Start Guide

## 🚀 Schnellstart (5 Minuten)

### 1. Supabase Setup

1. Gehe zu [supabase.com](https://supabase.com) und erstelle ein kostenloses Projekt
2. Warte, bis das Projekt erstellt ist (~2 Min)
3. Navigiere zu **SQL Editor** im Dashboard
4. Kopiere den Inhalt von `supabase/migrations/20260124_init_schema.sql`
5. Führe das SQL aus (Button "Run")
6. Optional: Führe auch `supabase/seed.sql` für Demo-Daten aus

### 2. Environment Variables

1. In Supabase: **Project Settings** → **API**
2. Kopiere:
   - `URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` Key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` Key (⚠️ geheim!) → `SUPABASE_SERVICE_ROLE_KEY`

3. In OpenAI: [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
4. Erstelle neuen Key → `OPENAI_API_KEY`

5. Füge alle in `.env.local` ein:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
OPENAI_API_KEY=sk-proj-xxxxx...
```

### 3. Starten

```bash
npm run dev
```

Öffne [http://localhost:3000](http://localhost:3000)

## ✅ Checklist

- [ ] Supabase-Projekt erstellt
- [ ] SQL-Migration ausgeführt
- [ ] Seed-Daten eingespielt (optional)
- [ ] `.env.local` mit allen 4 Keys erstellt
- [ ] `npm install` ausgeführt
- [ ] `npm run dev` läuft
- [ ] Browser öffnet http://localhost:3000
- [ ] Chat-Interface ist sichtbar

## 🎯 Erste Frage testen

Probiere aus:
- "Was sind React Server Components?"
- "Erkläre mir das Vercel AI SDK"
- "Wie funktioniert pgvector?"

Das System sollte:
1. ✅ Wissensdatenbank durchsuchen
2. ✅ Relevante Quellen finden
3. ✅ Antwort streamen
4. ✅ Quellen anzeigen

## 🐛 Probleme?

### Port 3000 bereits belegt
```bash
npm run dev -- -p 3001
```

### "Missing environment variables"
- Überprüfe `.env.local` existiert
- Alle 4 Variablen gesetzt?
- Keine Leerzeichen nach `=`

### "OpenAI API error"
- API-Key korrekt?
- Guthaben vorhanden? (Check: platform.openai.com/usage)

### "Supabase RPC error"
- SQL-Migration ausgeführt?
- In Supabase SQL Editor: `SELECT * FROM knowledge_base LIMIT 1;`
- Sollte funktionieren (evtl. leer)

## 📚 Nächste Schritte

1. **Eigene Daten hinzufügen**: Nutze die Server Action `ingestDocument`
2. **Deployment**: Push zu GitHub → Vercel Import → Environment-Variables setzen
3. **Customization**: Ändere System-Prompt in `llm-service.ts`

Viel Erfolg! 🚀
