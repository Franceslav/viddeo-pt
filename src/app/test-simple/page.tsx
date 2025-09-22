'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function TestSimplePage() {
  const [url, setUrl] = useState('https://rezka.ag/cartoons/comedy/1760-yuzhny-park-1997-latest/87-paramount-comedy.html')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testRezka = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/rezka/json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      })
      const data = await response.json()
      setResult(data)
    } catch (error: unknown) {
      if (error instanceof Error) {
        setResult({ error: error.message })
      } else {
        setResult({ error: String(error) })
      }
    } finally {
      setLoading(false)
    }
  }

  const testSearch = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/search/rezka?q=южный парк')
      const data = await response.json()
      setResult(data)
    } catch (error: unknown) {
      if (error instanceof Error) {
        setResult({ error: error.message })
      } else {
        setResult({ error: String(error) })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Простой тест API</h1>
      
      <div className="space-y-4 mb-8">
        <div className="flex gap-4">
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="URL для тестирования"
            className="flex-1"
          />
          <Button onClick={testRezka} disabled={loading}>
            {loading ? 'Загрузка...' : 'Тест Rezka'}
          </Button>
        </div>
        
        <Button onClick={testSearch} disabled={loading}>
          {loading ? 'Загрузка...' : 'Тест поиска'}
        </Button>
      </div>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Результат:</CardTitle>
            <CardDescription>
              {result.success ? 'Успешно' : 'Ошибка'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap text-sm bg-gray-100 p-4 rounded">
              {JSON.stringify(result, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
