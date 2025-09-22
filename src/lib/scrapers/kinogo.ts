import axios from 'axios'
import * as cheerio from 'cheerio'

export type ScrapedEpisode = {
  title: string
  url: string
  seasonNumber?: number
  episodeNumber?: number
}

export async function scrapeKinogo(targetUrl: string): Promise<ScrapedEpisode[]> {
  const httpsProxy = process.env.KINOGO_PROXY
  const agent = httpsProxy ? new (await import('https-proxy-agent')).HttpsProxyAgent(httpsProxy) : undefined

  const fetchHtml = async (url: string) => {
    const res = await axios.get<string>(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'ru,en;q=0.9',
        'Referer': new URL(url).origin + '/',
      },
      httpAgent: agent as any,
      httpsAgent: agent as any,
      timeout: 20000,
      validateStatus: () => true,
    })
    if (res.status >= 400 || !res.data || res.data.length < 500) {
      throw new Error(`Source blocked or unavailable (status ${res.status})`)
    }
    return res.data
  }

  const html = await fetchHtml(targetUrl)

  const $ = cheerio.load(html)
  const episodes: ScrapedEpisode[] = []

  const pushIfUrl = (title: string, url: string) => {
    if (!url) return
    const abs = new URL(url, targetUrl).toString()
    if (!/\.(m3u8|mp4)(\?|$)/i.test(abs) && !/playlist|player|video/i.test(abs)) return
    episodes.push({ title, url: abs })
  }

  const parseHtml = ($ctx: cheerio.CheerioAPI, baseUrl: string) => {
    // 1) <source src>, <video src>
    $ctx('source[src], video[src]').each((_, el) => {
      const src = $ctx(el).attr('src') || ''
      const title = $ctx(el).attr('title') || 'Эпизод'
      pushIfUrl(title, new URL(src, baseUrl).toString())
    })

    // 2) data-* атрибуты с файлами
    $ctx('[data-file], [data-url], [data-src]').each((_, el) => {
      const src = $ctx(el).attr('data-file') || $ctx(el).attr('data-url') || $ctx(el).attr('data-src') || ''
      if (src) pushIfUrl('Эпизод', new URL(src, baseUrl).toString())
    })

    // 3) Ссылки, которые прямо указывают на видео/плейлисты
    $ctx('a[href]').each((_, el) => {
      const href = $ctx(el).attr('href') || ''
      const text = $ctx(el).text().trim()
      if (!href) return
      const abs = new URL(href, baseUrl).toString()
      if (/\.(m3u8|mp4)(\?|$)/i.test(abs)) {
        episodes.push({ title: text || 'Эпизод', url: abs })
      }
    })

    // 4) Ищем в script прямые ссылки и playlist-объекты
    $ctx('script').each((_, el) => {
      const content = $ctx(el).html() || ''
      if (!content) return

      const urlRegex = /(https?:\/\/[^'"\s]+\.(?:m3u8|mp4))/gi
      const found = content.match(urlRegex)
      if (found) {
        for (const u of found) {
          episodes.push({ title: 'Эпизод', url: u })
        }
      }

      const itemRegex = /\{[^}]*?(file|url)\s*:\s*['"](https?:[^'"}]+)['"][^}]*?\}/gi
      let m: RegExpExecArray | null
      while ((m = itemRegex.exec(content)) !== null) {
        episodes.push({ title: 'Эпизод', url: m[2] })
      }
    })
  }

  // Парсим основную страницу
  parseHtml($, targetUrl)

  // Если после первичного прохода ничего не нашли — пробуем отрисовать страницу через headless Chromium
  if (episodes.length === 0) {
    try {
      const { chromium } = await import('playwright-chromium')
      const proxy = process.env.KINOGO_PROXY
      const browser = await chromium.launch({ headless: true })
      const context = await browser.newContext({
        proxy: proxy ? { server: proxy } : undefined,
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
      })
      const page = await context.newPage()
      await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 30000 })
      // Дождёмся возможной динамической вставки iframe/плеера
      await page.waitForTimeout(1500)
      const htmlDyn = await page.content()
      await browser.close()
      const $dyn = cheerio.load(htmlDyn)
      parseHtml($dyn, targetUrl)
    } catch {
      // тихо игнорим фоллбек
    }
  }

  // Переходим по iframe и парсим вложенные страницы (до 3 штук)
  $('iframe').each((_, el) => {
    const src = $(el).attr('src') || ''
    if (!src) return
    pushIfUrl('Плеер', src)
  })

  const iframeSrcs = Array.from(new Set($('iframe').map((_, el) => new URL($(el).attr('src') || '', targetUrl).toString()).get()))
    .slice(0, 3)
  for (const iframeUrl of iframeSrcs) {
    try {
      const html2 = await fetchHtml(iframeUrl)
      const $2 = cheerio.load(html2)
      parseHtml($2, iframeUrl)
    } catch {
      // пропускаем неудачные вложенные ресурсы
    }
  }

  // Поиск ссылок на серии: элементы, где есть номер эпизода/сезона
  $('a').each((_, el) => {
    const href = $(el).attr('href') || ''
    const text = $(el).text().trim()
    if (!href || !text) return

    const abs = new URL(href, targetUrl).toString()
    const match = text.match(/(сезон|season)\s*(\d+).*?(сер(ия|.)|episode)\s*(\d+)/i)
    const ep: ScrapedEpisode = { title: text, url: abs }
    if (match) {
      ep.seasonNumber = Number(match[2])
      ep.episodeNumber = Number(match[5])
    }
    if (/сер(ия|\.)|episode|ep\b/i.test(text) || /episode|ep\b/i.test(abs)) {
      episodes.push(ep)
    }
  })

  // Поиск прямых URL в script
  $('script').each((_, el) => {
    const content = $(el).html() || ''
    if (!content) return

    const urlRegex = /(https?:\/\/[^'"\s]+\.(?:m3u8|mp4))/gi
    const found = content.match(urlRegex)
    if (found) {
      for (const u of found) {
        const titleMatch = content.match(/\b(title|name)\s*[:=]\s*['"]([^'"]+)['"]/i)
        const title = titleMatch ? titleMatch[2] : 'Эпизод'
        episodes.push({ title, url: u })
      }
    }

    const itemRegex = /\{[^}]*?(file|url)\s*:\s*['"](https?:[^'"]+)['"][^}]*?\}/gi
    let m: RegExpExecArray | null
    while ((m = itemRegex.exec(content)) !== null) {
      const fileUrl = m[2]
      const tMatch = /title\s*:\s*['"]([^'"]+)['"]/i.exec(content)
      const t = tMatch ? tMatch[1] : 'Эпизод'
      episodes.push({ title: t, url: fileUrl })
    }
  })

  const norm = episodes
    .filter(e => !!e.url)
    .map(e => ({ ...e, url: e.url.replace(/&amp;/g, '&') }))

  const seen = new Set<string>()
  const unique = norm.filter(e => {
    const key = e.url + '|' + (e.title || '')
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })

  unique.sort((a, b) => {
    const sa = a.seasonNumber ?? 9999
    const sb = b.seasonNumber ?? 9999
    if (sa !== sb) return sa - sb
    const ea = a.episodeNumber ?? 9999
    const eb = b.episodeNumber ?? 9999
    return ea - eb
  })

  return unique
}
