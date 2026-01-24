import type { Metadata } from 'next'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SeedButton } from '@/features/rag-chat/components/seed-button'

export const metadata: Metadata = {
  title: 'Admin - Seed Database',
}

export default function AdminPage() {
  return (
    <main className="min-h-screen py-12 px-4 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Database Seeding</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-6">
              Klicke auf den Button um die Knowledge-Base mit Demo-Dokumenten zu füllen.
              Dies generiert echte OpenAI-Embeddings für jedes Dokument.
            </p>
            <SeedButton />
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
