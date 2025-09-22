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
    const episodes = await getRezkaEpisodes(url)
    return NextResponse.json({ 
      success: true, 
      url,
      episodes 
    })
  } catch (error) {
    console.error('Rezka episodes error:', error)
    return NextResponse.json({ 
      error: 'Failed to get episodes from Rezka',
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

    const episodes = await getRezkaEpisodes(url)
    return NextResponse.json({ 
      success: true, 
      url,
      episodes 
    })
  } catch (error) {
    console.error('Rezka episodes error:', error)
    return NextResponse.json({ 
      error: 'Failed to get episodes from Rezka',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

async function getRezkaEpisodes(url: string) {
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
  const episodes = []

  // Ищем информацию о сериале
  const title = $('.b-post__title h1').text().trim()
  const description = $('.b-post__description_text').text().trim()
  const poster = $('.b-post__cover img').attr('src')
  const year = $('.b-post__info .year').text().trim()

  // Ищем сезоны и эпизоды
  $('.b-simple_season__list').each((seasonIndex, seasonElement) => {
    const $season = $(seasonElement)
    const seasonTitle = $season.find('.b-simple_season__title').text().trim()
    const seasonNumber = seasonIndex + 1

    $season.find('.b-simple_episode__item').each((episodeIndex, episodeElement) => {
      const $episode = $(episodeElement)
      const episodeLink = $episode.find('a').attr('href')
      const episodeTitle = $episode.find('.b-simple_episode__title').text().trim()
      const episodeNumber = episodeIndex + 1

      if (episodeLink) {
        episodes.push({
          seasonNumber,
          seasonTitle,
          episodeNumber,
          title: episodeTitle || `Эпизод ${episodeNumber}`,
          url: episodeLink.startsWith('http') ? episodeLink : `https://rezka.ag${episodeLink}`,
          seriesTitle: title,
          seriesDescription: description,
          seriesPoster: poster?.startsWith('http') ? poster : `https://rezka.ag${poster}`,
          seriesYear: year
        })
      }
    })
  })

  return {
    series: {
      title,
      description,
      poster: poster?.startsWith('http') ? poster : `https://rezka.ag${poster}`,
      year
    },
    episodes
  }
}
