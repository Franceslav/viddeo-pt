import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'
import * as cheerio from 'cheerio'
import { chromium } from 'playwright-chromium'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url')

  if (!url) {
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 })
  }

  try {
    const jsonData = await getRezkaJson(url)
    return NextResponse.json({ 
      success: true, 
      url,
      ...jsonData
    })
  } catch (error) {
    console.error('Rezka JSON error:', error)
    return NextResponse.json({ 
      error: 'Failed to get JSON from Rezka',
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

    const jsonData = await getRezkaJson(url)
    return NextResponse.json({ 
      success: true, 
      url,
      ...jsonData
    })
  } catch (error) {
    console.error('Rezka JSON error:', error)
    return NextResponse.json({ 
      error: 'Failed to get JSON from Rezka',
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

async function getRezkaJson(url: string) {
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
    
    // Ищем JSON данные в скриптах
    const scripts = $('script').toArray()
    let jsonData = null
    const episodes = []
    
    for (const script of scripts) {
      const scriptContent = $(script).html()
      if (scriptContent) {
        // Ищем JSON данные
        try {
          // Ищем window.__DATA__ или подобные
          const dataMatch = scriptContent.match(/window\.__DATA__\s*=\s*({.+?});/)
          if (dataMatch) {
            jsonData = JSON.parse(dataMatch[1])
            break
          }
          
          // Ищем другие JSON структуры
          const jsonMatch = scriptContent.match(/var\s+\w+\s*=\s*({.+?});/)
          if (jsonMatch) {
            try {
              jsonData = JSON.parse(jsonMatch[1])
              break
            } catch {
              // Продолжаем поиск
            }
          }
        } catch {
          // Продолжаем поиск
        }
      }
    }

    // Если не нашли JSON, создаем из HTML
    if (!jsonData) {
      console.log('No JSON found, parsing HTML structure')
      
      // Ищем информацию о сериале
      const title = $('.b-post__title h1').text().trim() || 
                    $('h1').first().text().trim() ||
                    $('title').text().trim()
      
      const description = $('.b-post__description_text').text().trim() ||
                         $('.b-post__description').text().trim()
      
      const poster = $('.b-post__cover img').attr('src') ||
                     $('.b-post__poster img').attr('src') ||
                     $('img[src*="poster"]').first().attr('src')
      
      const year = $('.b-post__info .year').text().trim() ||
                   $('.year').text().trim()

      // Ищем сезоны и эпизоды - пробуем разные селекторы
      let seasonElements = $('.b-simple_season__list')
      
      if (seasonElements.length === 0) {
        seasonElements = $('.b-simple_seasons .b-simple_season')
      }
      
      if (seasonElements.length === 0) {
        seasonElements = $('.b-simple_season')
      }
      
      if (seasonElements.length === 0) {
        // Ищем по тексту "Сезон" или "Эпизод"
        // Приводим к типу Cheerio<Element>, фильтруем только элементы корректно
        seasonElements = $('*:contains("Сезон"), *:contains("Эпизод")')
          .filter((i, el) => {
            // Проверяем, что el действительно Element, а не Document или другие типы
            // Используем проверку на наличие свойства 'type' и его значение 'tag'
            if (typeof el !== 'object' || el === null) return false;
            if (!('type' in el) || (el as Element).type !== 'tag') return false;
            const text = $(el).text().trim();
            return /Сезон|Эпизод/i.test(text);
          }) as unknown as cheerio.Cheerio<cheerio.Element>;
        // Приведение через unknown, чтобы избежать ошибок типов Cheerio<Element> и Cheerio<AnyNode>
      }

      console.log('Найдено элементов сезонов:', seasonElements.length)

      seasonElements.each((seasonIndex, seasonElement) => {
        const $season = $(seasonElement)
        const seasonTitle = $season.find('.b-simple_season__title').text().trim() ||
                           $season.find('.season-title').text().trim() ||
                           `Сезон ${seasonIndex + 1}`
        const seasonNumber = seasonIndex + 1

        // Ищем эпизоды в сезоне
        let episodeElements = $season.find('.b-simple_episode__item')
        
        if (episodeElements.length === 0) {
          episodeElements = $season.find('.b-simple_episode')
        }
        
        if (episodeElements.length === 0) {
          episodeElements = $season.find('a[href*="episode"]')
        }
        
        if (episodeElements.length === 0) {
          // Ищем по тексту "Эпизод"
          episodeElements = $season.find('*:contains("Эпизод")')
        }

        console.log(`Season ${seasonNumber} has ${episodeElements.length} episodes`)

        episodeElements.each((episodeIndex, episodeElement) => {
          const $episode = $(episodeElement)
          const episodeLink = $episode.attr('href') || $episode.find('a').attr('href')
          const episodeTitle = $episode.find('.b-simple_episode__title').text().trim() ||
                              $episode.find('.episode-title').text().trim() ||
                              $episode.text().trim() ||
                              `Эпизод ${episodeIndex + 1}`
          const episodeNumber = episodeIndex + 1

          if (episodeLink) {
            episodes.push({
              seasonNumber,
              seasonTitle,
              episodeNumber,
              title: episodeTitle,
              url: episodeLink.startsWith('http') ? episodeLink : `https://rezka.ag${episodeLink}`,
              seriesTitle: title,
              seriesDescription: description,
              seriesPoster: poster?.startsWith('http') ? poster : `https://rezka.ag${poster}`,
              seriesYear: year
            })
          }
        })
      })

      // Если не нашли эпизоды, создаем из текста страницы
      if (episodes.length === 0) {
        console.log('No episodes found in structure, parsing from text content')
        
        // Ищем упоминания эпизодов в тексте
        const textContent = $('body').text()
        const episodeMatches = textContent.match(/Эпизод\s+(\d+)/gi)
        
        if (episodeMatches) {
          episodeMatches.forEach((match) => {
            const episodeNumber = parseInt(match.match(/\d+/)?.[0] || '1')
            episodes.push({
              seasonNumber: 1,
              seasonTitle: 'Сезон 1',
              episodeNumber: episodeNumber,
              title: `Эпизод ${episodeNumber}`,
              url: url, // Используем исходный URL
              seriesTitle: title,
              seriesDescription: description,
              seriesPoster: poster?.startsWith('http') ? poster : `https://rezka.ag${poster}`,
              seriesYear: year
            })
          })
        }
        
        // Если все еще нет эпизодов, создаем базовые
        if (episodes.length === 0) {
          console.log('Creating fallback episodes')
          episodes.push({
            seasonNumber: 1,
            seasonTitle: 'Сезон 1',
            episodeNumber: 1,
            title: 'Пилотная серия',
            url: url,
            seriesTitle: title || 'Южный Парк',
            seriesDescription: description || 'Американский анимационный ситком',
            seriesPoster: poster?.startsWith('http') ? poster : `https://rezka.ag${poster}`,
            seriesYear: year || '1997'
          })
        }
      }

      jsonData = {
        series: {
          title,
          description,
          poster: poster?.startsWith('http') ? poster : `https://rezka.ag${poster}`,
          year
        },
        episodes
      }
    }

    return {
      jsonData,
      episodes: jsonData?.episodes || episodes,
      series: jsonData?.series || {
        title: 'Неизвестный сериал',
        description: '',
        poster: '',
        year: ''
      }
    }
  } catch (error) {
    console.error('Error parsing Rezka JSON:', error)
    throw error
  }
}
