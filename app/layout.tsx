/**
 * Was macht layout.tsx in Next.js?
 * 
 * - layout.tsx ist ein sogenanntes "Root Layout" im Next.js App Router (ab v13).
 * - Es definiert das HTML-Grundgerüst (z.B. <html>, <body>) und globale Styles/Fonts.
 * - Alles, was hier steht, wird für jede Seite und jeden Route-Change wiederverwendet (persistiert).
 * - Typisch für Layouts: globale Navigation, Footer, Theme, Fonts, <head>-Meta, Viewport.
 * - In Angular gibt es kein direktes Äquivalent, aber das AppComponent-Template (app.component.html) ist am ähnlichsten.
 * - Layouts können in Next.js verschachtelt werden (z.B. für verschiedene Bereiche der App).
 * 
 * Wichtig:
 * - Das Layout erhält alle Seiten als {children} und rendert sie im <body>.
 * - Hier werden auch globale Metadaten (SEO, Theme, Viewport) gesetzt.
 * - Fonts werden global eingebunden.
 * 

 */

import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'RAG Challenge - Next.js 15 & React 19',
  description: 'Enterprise RAG System with Retrieval-Augmented Generation, built with Next.js 15, React 19, Vercel AI SDK, and Supabase pgvector',
  keywords: ['RAG', 'Next.js', 'React 19', 'AI', 'Supabase', 'pgvector', 'OpenAI'],
  authors: [{ name: 'RAG Challenge' }],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#2563eb',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="de" className={inter.variable}>
      <body className="antialiased bg-[#0a0a0f] min-h-screen" suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
