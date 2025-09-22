import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/config/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { title, description, url, userId } = body

    // Валидация обязательных полей
    if (!title || !description || !url || !userId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required fields: title, description, url, userId' 
      }, { status: 400 })
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

    // Создаем видео
    const video = await prisma.video.create({
      data: {
        title,
        description,
        url,
        userId
      }
    })

    return NextResponse.json({ 
      success: true, 
      video: {
        id: video.id,
        title: video.title,
        description: video.description,
        url: video.url,
        userId: video.userId,
        views: video.views,
        createdAt: video.createdAt
      }
    })

  } catch (error) {
    console.error('Video creation error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to create video' 
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    const videos = await prisma.video.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { name: true, email: true }
        }
      }
    })

    return NextResponse.json({ 
      success: true, 
      videos 
    })

  } catch (error) {
    console.error('Videos fetch error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch videos' 
    }, { status: 500 })
  }
}
