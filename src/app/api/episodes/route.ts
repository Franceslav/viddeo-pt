import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/config/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { title, description, url, episodeNumber, seasonId, userId, image } = body

    // Валидация обязательных полей
    if (!title || !description || !url || !episodeNumber || !seasonId || !userId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required fields: title, description, url, episodeNumber, seasonId, userId' 
      }, { status: 400 })
    }

    // Проверяем, существует ли сезон
    const season = await prisma.season.findUnique({
      where: { id: seasonId }
    })

    if (!season) {
      return NextResponse.json({ 
        success: false, 
        error: 'Season not found' 
      }, { status: 404 })
    }

    // Проверяем, существует ли пользователь
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json({ 
        success: false, 
        error: 'User not found' 
      }, { status: 404 })
    }

    // Проверяем, не существует ли уже эпизод с таким номером в сезоне
    const existingEpisode = await prisma.episode.findFirst({
      where: {
        seasonId,
        episodeNumber
      }
    })

    if (existingEpisode) {
      return NextResponse.json({ 
        success: false, 
        error: 'Episode with this number already exists in this season' 
      }, { status: 409 })
    }

    // Создаем эпизод
    const episode = await prisma.episode.create({
      data: {
        title,
        description,
        url,
        episodeNumber,
        seasonId,
        userId,
        image: image || null
      },
      include: {
        season: true,
        user: {
          select: { name: true, email: true }
        },
        likes: true
      }
    })

    return NextResponse.json({ 
      success: true, 
      episode: {
        id: episode.id,
        title: episode.title,
        description: episode.description,
        url: episode.url,
        episodeNumber: episode.episodeNumber,
        seasonId: episode.seasonId,
        season: episode.season,
        userId: episode.userId,
        user: episode.user,
        image: episode.image,
        views: episode.views,
        likes: episode.likes,
        createdAt: episode.createdAt
      }
    })

  } catch (error) {
    console.error('Episode creation error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to create episode' 
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const seasonId = searchParams.get('seasonId')

    let episodes

    if (seasonId) {
      // Получить эпизоды конкретного сезона
      episodes = await prisma.episode.findMany({
        where: { seasonId },
        orderBy: { episodeNumber: 'asc' }
      })
    } else {
      // Получить все эпизоды
      episodes = await prisma.episode.findMany({
        orderBy: { episodeNumber: 'asc' }
      })
    }

    return NextResponse.json({ 
      success: true, 
      episodes 
    })

  } catch (error) {
    console.error('Episodes fetch error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch episodes' 
    }, { status: 500 })
  }
}
