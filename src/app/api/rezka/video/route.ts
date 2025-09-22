import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'
import * as cheerio from 'cheerio'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url')

  if (!url) {
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 })
  }

  try {
    const videoData = await getRezkaVideo(url)
    return NextResponse.json({ 
      success: true, 
      url,
      ...videoData
    })
  } catch (error) {
    console.error('Rezka video error:', error)
    return NextResponse.json({ 
      error: 'Failed to get video from Rezka',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()
    
    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    const videoData = await getRezkaVideo(url)
    return NextResponse.json({ 
      success: true, 
      url,
      ...videoData
    })
  } catch (error) {
    console.error('Rezka video error:', error)
    return NextResponse.json({ 
      error: 'Failed to get video from Rezka',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

async function getRezkaVideo(url: string) {
  const response = await axios.get(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'ru-RU,ru;q=0.8,en-US;q=0.5,en;q=0.3',
      'Accept-Encoding': 'gzip, deflate, br',
      'Referer': 'https://rezka.ag/'
    },
    timeout: 15000
  })

  const $ = cheerio.load(response.data)
  
  // Ищем плееры
  const players = []
  
  $('.b-simple_episode__item').each((index, element) => {
    const $item = $(element)
    const playerTitle = $item.find('.b-simple_episode__title').text().trim()
    const playerLink = $item.find('a').attr('href')
    
    if (playerTitle && playerLink) {
      players.push({
        title: playerTitle,
        url: playerLink.startsWith('http') ? playerLink : `https://rezka.ag${playerLink}`
      })
    }
  })

  // Ищем iframe с плеером
  const iframe = $('iframe[src*="player"]').attr('src')
  
  // Ищем скрипты с видео данными
  const scripts = $('script').toArray()
  let videoUrls = []
  
  for (const script of scripts) {
    const scriptContent = $(script).html()
    if (scriptContent && scriptContent.includes('file:')) {
      // Пытаемся извлечь URL видео из скрипта
      const urlMatches = scriptContent.match(/file:\s*['"]([^'"]+)['"]/g)
      if (urlMatches) {
        urlMatches.forEach(match => {
          const url = match.replace(/file:\s*['"]/, '').replace(/['"]$/, '')
          if (url && (url.includes('.mp4') || url.includes('.m3u8') || url.includes('video'))) {
            videoUrls.push(url)
          }
        })
      }
    }
  }

  return {
    players,
    iframe,
    videoUrls: [...new Set(videoUrls)], // Убираем дубликаты
    title: $('.b-post__title h1').text().trim(),
    description: $('.b-post__description_text').text().trim(),
    poster: $('.b-post__cover img').attr('src')
  }
}
