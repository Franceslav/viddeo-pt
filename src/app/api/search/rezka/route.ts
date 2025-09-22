import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'
import * as cheerio from 'cheerio'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')

  if (!query) {
    return NextResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 })
  }

  try {
    const results = await searchRezka(query)
    return NextResponse.json({ 
      success: true, 
      query,
      results 
    })
  } catch (error) {
    console.error('Rezka search error:', error)
    return NextResponse.json({ 
      error: 'Failed to search on Rezka',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()
    
    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 })
    }

    const results = await searchRezka(query)
    return NextResponse.json({ 
      success: true, 
      query,
      results 
    })
  } catch (error) {
    console.error('Rezka search error:', error)
    return NextResponse.json({ 
      error: 'Failed to search on Rezka',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

async function searchRezka(query: string) {
  const searchUrl = `https://rezka.ag/ajax/search?q=${encodeURIComponent(query)}`
  
  const response = await axios.get(searchUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'ru-RU,ru;q=0.8,en-US;q=0.5,en;q=0.3',
      'Accept-Encoding': 'gzip, deflate, br',
      'Referer': 'https://rezka.ag/',
      'Origin': 'https://rezka.ag'
    },
    timeout: 10000
  })

  const $ = cheerio.load(response.data)
  const results = []

  $('.b-content__inline_item').each((index, element) => {
    const $item = $(element)
    const title = $item.find('.b-content__inline_item-link a').text().trim()
    const link = $item.find('.b-content__inline_item-link a').attr('href')
    const poster = $item.find('.b-content__inline_item-cover img').attr('src')
    const year = $item.find('.b-content__inline_item-meta .year').text().trim()
    const type = $item.find('.b-content__inline_item-meta .type').text().trim()
    const description = $item.find('.b-content__inline_item-description').text().trim()

    if (title && link) {
      results.push({
        title,
        link: link.startsWith('http') ? link : `https://rezka.ag${link}`,
        poster: poster?.startsWith('http') ? poster : `https://rezka.ag${poster}`,
        year,
        type,
        description
      })
    }
  })

  return results
}
