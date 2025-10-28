import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/config/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ 
        success: false, 
        error: 'Необходима авторизация' 
      }, { status: 401 })
    }

    const body = await request.json()
    const { content, episodeId, parentId } = body

    if (!content || !episodeId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Отсутствуют обязательные поля' 
      }, { status: 400 })
    }

    // Проверяем, существует ли эпизод
    const episode = await prisma.episode.findUnique({
      where: { id: episodeId }
    })

    if (!episode) {
      return NextResponse.json({ 
        success: false, 
        error: 'Эпизод не найден' 
      }, { status: 404 })
    }

    // Создаем комментарий
    const comment = await prisma.comment.create({
      data: {
        content,
        episodeId,
        userId: session.user.id,
        parentId: parentId || null
      },
      include: {
        user: {
          select: { name: true, email: true }
        }
      }
    })

    return NextResponse.json({ 
      success: true, 
      comment: {
        id: comment.id,
        content: comment.content,
        createdAt: comment.createdAt,
        user: comment.user
      }
    })

  } catch (error) {
    console.error('Comment creation error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Ошибка при создании комментария' 
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const episodeId = searchParams.get('episodeId')

    if (!episodeId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Не указан ID эпизода' 
      }, { status: 400 })
    }

    const comments = await prisma.comment.findMany({
      where: { 
        episodeId,
        parentId: null // Только основные комментарии, не ответы
      },
      include: {
        user: {
          select: { name: true, email: true }
        },
        replies: {
          include: {
            user: {
              select: { name: true, email: true }
            }
          },
          orderBy: { createdAt: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ 
      success: true, 
      comments 
    })

  } catch (error) {
    console.error('Comments fetch error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Ошибка при загрузке комментариев' 
    }, { status: 500 })
  }
}
