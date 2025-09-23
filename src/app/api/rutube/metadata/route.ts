import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'
import * as cheerio from 'cheerio'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const videoId = searchParams.get('videoId')

  if (!videoId) {
    return NextResponse.json({ error: 'videoId parameter is required' }, { status: 400 })
  }

  try {
    const metadata = await getRutubeVideoMetadata(videoId)
    return NextResponse.json({ 
      success: true, 
      videoId,
      ...metadata
    })
  } catch (error) {
    console.error('RUTUBE metadata error:', error)
    return NextResponse.json({ 
      error: 'Failed to get RUTUBE video metadata',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

async function getRutubeVideoMetadata(videoId: string) {
  try {
    // Пытаемся получить метаданные через страницу видео
    const videoUrl = `https://rutube.ru/video/${videoId}/`
    
    const response = await axios.get(videoUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'ru-RU,ru;q=0.8,en-US;q=0.5,en;q=0.3',
        'Accept-Encoding': 'gzip, deflate, br',
        'Referer': 'https://rutube.ru/',
      },
      timeout: 15000
    })

    const $ = cheerio.load(response.data)
    
    // Извлекаем метаданные
    const title = $('meta[property="og:title"]').attr('content') ||
                  $('title').text().trim() ||
                  $('h1').first().text().trim() ||
                  'RUTUBE Видео'
    
    const description = $('meta[property="og:description"]').attr('content') ||
                       $('meta[name="description"]').attr('content') ||
                       $('.video-description').text().trim() ||
                       ''
    
    const author = $('meta[name="author"]').attr('content') ||
                   $('.channel-name').text().trim() ||
                   $('.author-name').text().trim() ||
                   'RUTUBE'
    
    const thumbnail = $('meta[property="og:image"]').attr('content') ||
                     $('.video-thumbnail img').attr('src') ||
                     ''
    
    // Пытаемся извлечь длительность из JSON-LD или других источников
    let duration = null
    const jsonLd = $('script[type="application/ld+json"]').html()
    if (jsonLd) {
      try {
        const data = JSON.parse(jsonLd)
        if (data.duration) {
          duration = data.duration
        }
      } catch {
        // Игнорируем ошибки парсинга JSON
      }
    }
    
    // Если не нашли в JSON-LD, пытаемся извлечь из текста
    if (!duration) {
      const durationText = $('.video-duration').text().trim() ||
                          $('.duration').text().trim()
      if (durationText) {
        // Пытаемся парсить длительность вида "5:30" или "1:23:45"
        const match = durationText.match(/(\d+):(\d+)(?::(\d+))?/)
        if (match) {
          const hours = match[3] ? parseInt(match[1]) : 0
          const minutes = parseInt(match[3] ? match[2] : match[1])
          const seconds = match[3] ? parseInt(match[3]) : parseInt(match[2])
          duration = hours * 3600 + minutes * 60 + seconds
        }
      }
    }

    return {
      title,
      description,
      author,
      thumbnail,
      duration,
      embedUrl: `https://rutube.ru/play/embed/${videoId}`
    }
    
  } catch (error) {
    console.error('Error fetching RUTUBE metadata:', error)
    
    // Возвращаем базовые данные в случае ошибки
    return {
      title: 'RUTUBE Видео',
      description: '',
      author: 'RUTUBE',
      thumbnail: '',
      duration: null,
      embedUrl: `https://rutube.ru/play/embed/${videoId}`
    }
  }
}
