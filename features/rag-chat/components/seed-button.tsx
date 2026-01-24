'use client'

import { useState } from 'react'
import { Button } from '../../../components/ui/button'
import { Spinner } from '../../../components/ui/spinner'
import { seedKnowledgeBase } from '../../../app/actions/seed.action'

export function SeedButton() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  async function handleSeed() {
    setLoading(true)
    setResult(null)
    
    try {
      const res = await seedKnowledgeBase()
      if (res.success) {
        setResult(`✅ ${res.message}`)
      } else {
        setResult(`❌ ${res.message}`)
      }
    } catch (error) {
      setResult(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Button onClick={handleSeed} disabled={loading} size="lg">
        {loading && <Spinner size="sm" className="mr-2" />}
        {loading ? 'Seeding...' : 'Seed Knowledge Base'}
      </Button>
      
      {result && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
          <pre className="text-sm whitespace-pre-wrap">{result}</pre>
        </div>
      )}
    </div>
  )
}
