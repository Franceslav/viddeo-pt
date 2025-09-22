import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'
import * as cheerio from 'cheerio'
import { chromium } from 'playwright-chromium'

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()
    
    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    const videoUrl = await getVideoUrl(url)
    return NextResponse.json({ 
      success: true, 
      url,
      videoUrl
    })
  } catch (error) {
    console.error('Video URL extraction error:', error)
    return NextResponse.json({ 
      error: 'Failed to extract video URL',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

async function fetchHtmlWithPlaywright(targetUrl: string): Promise<string> {
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    locale: 'ru-RU',
    extraHTTPHeaders: {
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'ru-RU,ru;q=0.8,en-US;q=0.5,en;q=0.3',
      'Upgrade-Insecure-Requests': '1',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'same-origin',
    },
  })
  const page = await context.newPage()
  try {
    await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 30000 })
    await page.waitForTimeout(2000)
    const html = await page.content()
    return html
  } finally {
    await page.close().catch(() => {})
    await context.close().catch(() => {})
    await browser.close().catch(() => {})
  }
}

async function getVideoUrl(url: string): Promise<string | null> {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'ru-RU,ru;q=0.8,en-US;q=0.5,en;q=0.3',
        'Accept-Encoding': 'gzip, deflate, br',
        'Referer': 'https://rezka.ag/',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
      timeout: 20000,
      maxRedirects: 5,
      validateStatus: (status) => status < 500
    })

    let html = ''
    if (response.status >= 400) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    } else {
      html = String(response.data || '')
    }

    // Проверка на антибот/пустой ответ
    const looksBlocked = html.length < 2000 || /Cloudflare|Just a moment|attention required/i.test(html)

    if (looksBlocked) {
      console.warn('Rezka response looks blocked, using Playwright fallback')
      html = await fetchHtmlWithPlaywright(url)
    }

    const $ = cheerio.load(html)
    
    // Ищем видео URL в различных местах
    let videoUrl = null

    // 1. Ищем в iframe src
    const iframe = $('iframe[src*="player"]').attr('src')
    if (iframe) {
      console.log('Found iframe:', iframe)
      // Если iframe содержит прямую ссылку на видео
      if (iframe.includes('.mp4') || iframe.includes('.m3u8') || iframe.includes('.webm')) {
        videoUrl = iframe
      }
    }

    // 2. Ищем в скриптах
    if (!videoUrl) {
      const scripts = $('script').toArray()
      for (const script of scripts) {
        const scriptContent = $(script).html()
        if (scriptContent) {
          // Ищем различные паттерны видео URL
          const patterns = [
            /file:\s*["']([^"']+\.(mp4|m3u8|webm|ogg))["']/i,
            /src:\s*["']([^"']+\.(mp4|m3u8|webm|ogg))["']/i,
            /url:\s*["']([^"']+\.(mp4|m3u8|webm|ogg))["']/i,
            /video[^"']*["']([^"']+\.(mp4|m3u8|webm|ogg))["']/i,
            /player[^"']*["']([^"']+\.(mp4|m3u8|webm|ogg))["']/i,
            /https?:\/\/[^"'\s]+\.(mp4|m3u8|webm|ogg)/i
          ]

          for (const pattern of patterns) {
            const match = scriptContent.match(pattern)
            if (match) {
              videoUrl = match[1]
              console.log('Found video URL in script:', videoUrl)
              break
            }
          }
          if (videoUrl) break
        }
      }
    }

    // 3. Ищем в data-атрибутах
    if (!videoUrl) {
      const dataElements = $('[data-file], [data-src], [data-url], [data-video]')
      dataElements.each((i, el) => {
        const $el = $(el)
        const dataFile = $el.attr('data-file') || $el.attr('data-src') || $el.attr('data-url') || $el.attr('data-video')
        if (dataFile && (dataFile.includes('.mp4') || dataFile.includes('.m3u8') || dataFile.includes('.webm'))) {
          videoUrl = dataFile
          console.log('Found video URL in data attribute:', videoUrl)
          return false // break
        }
      })
    }

    // 4. Ищем в ссылках
    if (!videoUrl) {
      const links = $('a[href*=".mp4"], a[href*=".m3u8"], a[href*=".webm"]')
      if (links.length > 0) {
        videoUrl = links.first().attr('href')
        console.log('Found video URL in link:', videoUrl)
      }
    }

    // Если нашли URL, делаем его абсолютным
    if (videoUrl) {
      if (videoUrl.startsWith('//')) {
        videoUrl = 'https:' + videoUrl
      } else if (videoUrl.startsWith('/')) {
        videoUrl = 'https://rezka.ag' + videoUrl
      } else if (!videoUrl.startsWith('http')) {
        videoUrl = 'https://rezka.ag/' + videoUrl
      }
    }

    console.log('Final video URL:', videoUrl)
    return videoUrl

  } catch (error) {
    console.error('Error extracting video URL:', error)
    throw error
  }
}
