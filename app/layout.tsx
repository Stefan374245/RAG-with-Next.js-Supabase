import type { Metadata } from 'next'
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
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#2563eb',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="de" className={inter.variable}>
      <body className="antialiased bg-gray-50 min-h-screen" suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
