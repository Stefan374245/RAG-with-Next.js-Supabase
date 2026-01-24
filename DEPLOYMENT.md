# Deployment Checklist für Vercel

## ✅ Pre-Deployment

- [ ] Git Repository erstellt und Code committed
- [ ] `.env.local` NICHT committed (steht in .gitignore)
- [ ] `npm run build` lokal getestet
- [ ] Supabase-Projekt produktionsbereit
- [ ] OpenAI API-Key mit ausreichend Credits

## 🚀 Vercel Deployment

### 1. Repository verbinden

1. Gehe zu [vercel.com](https://vercel.com)
2. "Add New Project"
3. Import Git Repository
4. Framework Preset: **Next.js** (auto-detected)

### 2. Environment Variables setzen

In Vercel Project Settings → Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
OPENAI_API_KEY=sk-proj-...
```

⚠️ **Wichtig**: Alle Environments auswählen (Production, Preview, Development)

### 3. Build Settings

- Build Command: `npm run build` (default)
- Output Directory: `.next` (default)
- Install Command: `npm install` (default)
- Node Version: 20.x (recommended)

### 4. Deploy

1. Click "Deploy"
2. Warte ~2-3 Minuten
3. Vercel vergibt automatisch eine URL: `https://xxx.vercel.app`

## ✅ Post-Deployment

### Testen

1. Öffne Production-URL
2. Stelle eine Test-Frage
3. Check Vercel Logs bei Fehlern: Project → Deployments → [Latest] → Runtime Logs

### Domain Setup (Optional)

1. Vercel Project → Settings → Domains
2. Add Custom Domain
3. DNS-Einträge bei deinem Provider setzen (Vercel zeigt Anleitung)

## 🐛 Troubleshooting

### "Missing environment variables"
- Check Vercel Project Settings → Environment Variables
- Redeploy: Deployments → [Latest] → "Redeploy"

### "Supabase connection failed"
- Supabase: Settings → API → "Disable API rate limiting" (für Produktion)
- Check Supabase: Database → Connection Pooler aktiviert?

### "OpenAI API error 429"
- Rate Limit erreicht
- Upgrade OpenAI Plan oder warte

### Edge Function Timeout
- Vercel Free: 10s Timeout
- Bei langsamem Supabase: Upgrade zu Vercel Pro (60s Timeout)

## 📊 Monitoring

### Vercel Analytics (empfohlen)

```bash
npm install @vercel/analytics
```

In `app/layout.tsx`:
```tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

### Supabase Monitoring

- Dashboard → Reports → API Health
- Check Query-Performance
- Monitor Storage-Nutzung

## 🎉 Fertig!

Deine RAG-Challenge-App ist live!

**Teilen**:
- Demo-URL: `https://xxx.vercel.app`
- GitHub-Repo: `https://github.com/username/rag-challenge`
- LinkedIn-Post mit Screenshot 😉

---

**Pro-Tipps**:
- Vercel Preview-Deployments: Jeder Git-Branch bekommt auto. eigene URL
- Vercel Edge Config: Für Feature-Flags ohne Redeploy
- Supabase Branching: Separate Dev/Prod-Datenbanken
