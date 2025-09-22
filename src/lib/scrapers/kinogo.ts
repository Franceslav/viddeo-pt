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
  const agent = httpsProxy ? (await import('https-proxy-agent')).HttpsProxyAgent(httpsProxy) : undefined

  const { data: html, status } = await axios.get<string>(targetUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'ru,en;q=0.9',
      'Referer': new URL(targetUrl).origin + '/',
    },
    httpAgent: agent as any,
    httpsAgent: agent as any,
    timeout: 20000,
    validateStatus: () => true,
  })

  if (status >= 400 || !html || html.length < 500) {
    throw new Error(`Source blocked or unavailable (status ${status})`)
  }

  const $ = cheerio.load(html)
  const episodes: ScrapedEpisode[] = []

  // Попытка найти iframe плеера
  $('iframe').each((_, el) => {
    const src = $(el).attr('src') || ''
    if (!src) return
    if (/\.m3u8|\.mp4|playlist|video|player/.test(src)) {
      episodes.push({ title: 'Плеер', url: new URL(src, targetUrl).toString() })
    }
  })

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
