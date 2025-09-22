import { NextRequest, NextResponse } from 'next/server'
import { scrapeKinogo } from '@/lib/scrapers/kinogo'

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json()
    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'url is required' }, { status: 400 })
    }

    const episodes = await scrapeKinogo(url)
    return NextResponse.json({ episodes })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Unknown error' }, { status: 500 })
  }
}
