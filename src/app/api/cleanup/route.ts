import { NextResponse } from 'next/server'
import { prisma } from '@/config/prisma'

export async function DELETE() {
  try {
    console.log('Starting cleanup of all episodes and related data...')
    
    // Используем raw MongoDB запросы для обхода ограничений Prisma
    
    // 1. Удаляем все лайки
    await prisma.$runCommandRaw({
      delete: 'CommentLike',
      deletes: [{ q: {}, limit: 0 }]
    })
    await prisma.$runCommandRaw({
      delete: 'CharacterCommentLike',
      deletes: [{ q: {}, limit: 0 }]
    })
    await prisma.$runCommandRaw({
      delete: 'Like',
      deletes: [{ q: {}, limit: 0 }]
    })
    console.log('Deleted all likes')
    
    // 2. Удаляем все комментарии
    await prisma.$runCommandRaw({
      delete: 'Comment',
      deletes: [{ q: {}, limit: 0 }]
    })
    await prisma.$runCommandRaw({
      delete: 'CharacterComment',
      deletes: [{ q: {}, limit: 0 }]
    })
    console.log('Deleted all comments')
    
    // 3. Удаляем все эпизоды
    const episodeResult = await prisma.$runCommandRaw({
      delete: 'Episode',
      deletes: [{ q: {}, limit: 0 }]
    })
    console.log('Deleted all episodes')
    
    return NextResponse.json({ 
      success: true,
      message: 'All episodes and related data deleted successfully',
      deletedEpisodes: episodeResult.n || 0
    })
    
  } catch (error) {
    console.error('Cleanup error:', error)
    return NextResponse.json({ 
      success: false,
      error: 'Failed to delete episodes',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    // Получаем статистику
    const episodeCount = await prisma.episode.count()
    const commentCount = await prisma.comment.count()
    const likeCount = await prisma.like.count()
    const seasonCount = await prisma.season.count()
    
    return NextResponse.json({ 
      success: true,
      stats: {
        episodes: episodeCount,
        comments: commentCount,
        likes: likeCount,
        seasons: seasonCount
      }
    })
    
  } catch (error) {
    console.error('Stats error:', error)
    return NextResponse.json({ 
      success: false,
      error: 'Failed to get stats',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
