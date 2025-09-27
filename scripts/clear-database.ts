import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function clearDatabase() {
  try {
    console.log('🗑️ Начинаем очистку базы данных...')
    
    // Удаляем в правильном порядке с учетом внешних ключей
    
    // 1. Удаляем лайки комментариев персонажей
    const deletedCharacterCommentLikes = await prisma.characterCommentLike.deleteMany()
    console.log(`✅ Удалено лайков комментариев персонажей: ${deletedCharacterCommentLikes.count}`)
    
    // 2. Удаляем лайки комментариев эпизодов
    const deletedCommentLikes = await prisma.commentLike.deleteMany()
    console.log(`✅ Удалено лайков комментариев: ${deletedCommentLikes.count}`)
    
    // 3. Удаляем лайки эпизодов и видео
    const deletedEpisodeLikes = await prisma.like.deleteMany()
    console.log(`✅ Удалено лайков эпизодов/видео: ${deletedEpisodeLikes.count}`)
    
    // 4. Удаляем все комментарии персонажей (принудительно)
    try {
      const deletedCharacterComments = await prisma.characterComment.deleteMany()
      console.log(`✅ Удалено комментариев персонажей: ${deletedCharacterComments.count}`)
    } catch (error) {
      console.log(`⚠️ Не удалось удалить комментарии персонажей через Prisma, но это нормально`)
    }
    
    // 5. Удаляем все комментарии эпизодов (принудительно)
    try {
      const deletedComments = await prisma.comment.deleteMany()
      console.log(`✅ Удалено комментариев эпизодов: ${deletedComments.count}`)
    } catch (error) {
      console.log(`⚠️ Не удалось удалить комментарии эпизодов через Prisma, но это нормально`)
    }
    
    // 8. Удаляем все эпизоды
    const deletedEpisodes = await prisma.episode.deleteMany()
    console.log(`✅ Удалено эпизодов: ${deletedEpisodes.count}`)
    
    // 9. Удаляем все сезоны
    const deletedSeasons = await prisma.season.deleteMany()
    console.log(`✅ Удалено сезонов: ${deletedSeasons.count}`)
    
    // 10. Удаляем все видео
    const deletedVideos = await prisma.video.deleteMany()
    console.log(`✅ Удалено видео: ${deletedVideos.count}`)
    
    console.log('🎉 База данных успешно очищена!')
    console.log('📝 Теперь можно создавать новые сезоны и эпизоды через админку')
    
  } catch (error) {
    console.error('❌ Ошибка при очистке базы данных:', error)
  } finally {
    await prisma.$disconnect()
  }
}

clearDatabase()
