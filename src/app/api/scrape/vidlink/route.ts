import { NextRequest, NextResponse } from 'next/server';
import { scrapeVidLink, getVidLinkVideoUrl } from '@/lib/scrapers/vidlink';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, action = 'scrape' } = body;

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    if (action === 'scrape') {
      // Парсим данные сериала и эпизодов
      const result = await scrapeVidLink(url);
      return NextResponse.json(result);
    } 
    
    if (action === 'video-url') {
      // Получаем прямую ссылку на видео
      const { seriesId, seasonNumber, episodeNumber } = body;
      
      if (!seriesId || !seasonNumber || !episodeNumber) {
        return NextResponse.json(
          { error: 'seriesId, seasonNumber, and episodeNumber are required for video-url action' },
          { status: 400 }
        );
      }

      const videoUrl = await getVidLinkVideoUrl(seriesId, seasonNumber, episodeNumber);
      return NextResponse.json({ videoUrl });
    }

    return NextResponse.json(
      { error: 'Invalid action. Use "scrape" or "video-url"' },
      { status: 400 }
    );

  } catch (error) {
    console.error('VidLink API error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to scrape VidLink',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { 
      message: 'VidLink scraper API',
      usage: {
        scrape: 'POST with { "url": "https://vidlink.pro/tv/2190/2/5", "action": "scrape" }',
        videoUrl: 'POST with { "seriesId": "2190", "seasonNumber": 2, "episodeNumber": 5, "action": "video-url" }'
      }
    }
  );
}
