import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/config/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { title, description, seasonNumber, image } = body

    // Валидация обязательных полей
    if (!title || !seasonNumber) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required fields: title, seasonNumber' 
      }, { status: 400 })
    }

    // Проверяем, не существует ли уже сезон с таким номером
    const existingSeason = await prisma.season.findFirst({
      where: { seasonNumber }
    })

    if (existingSeason) {
      return NextResponse.json({ 
        success: false, 
        error: 'Season with this number already exists' 
      }, { status: 409 })
    }

    // Создаем сезон
    const season = await prisma.season.create({
      data: {
        title,
        description: description || null,
        seasonNumber,
        image: image || null
      }
    })

    return NextResponse.json({ 
      success: true, 
      season: {
        id: season.id,
        title: season.title,
        description: season.description,
        seasonNumber: season.seasonNumber,
        isActive: season.isActive,
        image: season.image,
        createdAt: season.createdAt
      }
    })

  } catch (error) {
    console.error('Season creation error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to create season' 
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    const seasons = await prisma.season.findMany({
      orderBy: { seasonNumber: 'asc' },
      include: {
        episodes: {
          orderBy: { episodeNumber: 'asc' },
          include: {
            likes: true
          }
        }
      }
    })

    return NextResponse.json({ 
      success: true, 
      seasons 
    })

  } catch (error) {
    console.error('Seasons fetch error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch seasons' 
    }, { status: 500 })
  }
}
