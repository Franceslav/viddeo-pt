'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

export default function TestApiPage() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testSearch = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/search/rezka?q=южный парк')
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ error: error.message })
    } finally {
      setLoading(false)
    }
  }

  const testEpisodes = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/rezka/episodes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          url: 'https://rezka.ag/series/comedy/32530-yuzhnyy-park-1997.html' 
        })
      })
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ error: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Тест API</h1>
      
      <div className="space-y-4 mb-8">
        <Button onClick={testSearch} disabled={loading}>
          {loading ? 'Загрузка...' : 'Тест поиска'}
        </Button>
        
        <Button onClick={testEpisodes} disabled={loading}>
          {loading ? 'Загрузка...' : 'Тест эпизодов'}
        </Button>
      </div>

      {result && (
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Результат:</h2>
          <pre className="whitespace-pre-wrap text-sm">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}
