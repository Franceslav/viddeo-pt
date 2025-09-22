import { z } from 'zod'
import { publicProcedure, router } from '@/app/server/trpc'

export const characterCommentRouter = router({
  // Получить комментарии персонажа
  getCharacterComments: publicProcedure
    .input(z.object({ characterId: z.string() }))
    .query(async ({ input, ctx }) => {
      return await ctx.db.characterComment.findMany({
        where: {
          characterId: input.characterId,
          parentId: { isSet: false } // Только родительские комментарии
        },
        include: {
          user: {
            select: { name: true, email: true, image: true }
          },
          replies: {
            include: {
              user: {
                select: { name: true, email: true, image: true }
              },
              characterCommentLikes: true,
              replies: { // Добавляем второй уровень вложенности
                include: {
                  user: {
                    select: { name: true, email: true, image: true }
                  },
                  characterCommentLikes: true
                },
                orderBy: { createdAt: 'asc' }
              }
            },
            orderBy: { createdAt: 'asc' }
          },
          characterCommentLikes: true
        },
        orderBy: { createdAt: 'desc' }
      })
    }),

  // Добавить комментарий к персонажу
  addCharacterComment: publicProcedure
    .input(z.object({ 
      characterId: z.string(), 
      content: z.string().min(1).max(1000),
      userId: z.string(),
      parentId: z.string().optional()
    }))
    .mutation(async ({ input, ctx }) => {
      const comment = await ctx.db.characterComment.create({
        data: {
          characterId: input.characterId,
          content: input.content,
          userId: input.userId,
          parentId: input.parentId
        },
        include: {
          user: {
            select: { name: true, email: true, image: true }
          },
          characterCommentLikes: true
        }
      })
      
      return comment
    }),

  // Удалить комментарий персонажа
  deleteCharacterComment: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      return await ctx.db.characterComment.delete({
        where: { id: input.id }
      })
    }),

  // Лайк/дизлайк комментария персонажа
  likeCharacterComment: publicProcedure
    .input(z.object({ 
      characterCommentId: z.string(), 
      userId: z.string(), 
      type: z.enum(['like', 'dislike']) 
    }))
    .mutation(async ({ input, ctx }) => {
      // Проверяем, есть ли уже такой лайк
      const existingLike = await ctx.db.characterCommentLike.findFirst({
        where: {
          AND: [
            { characterCommentId: input.characterCommentId },
            { userId: input.userId },
            { type: input.type }
          ]
        }
      })

      if (existingLike) {
        // Если лайк уже есть, удаляем его
        return await ctx.db.characterCommentLike.delete({
          where: { id: existingLike.id }
        })
      }

      // Удаляем противоположный тип лайка, если он есть
      const oppositeLike = await ctx.db.characterCommentLike.findFirst({
        where: {
          AND: [
            { characterCommentId: input.characterCommentId },
            { userId: input.userId },
            { type: input.type === 'like' ? 'dislike' : 'like' }
          ]
        }
      })

      if (oppositeLike) {
        await ctx.db.characterCommentLike.delete({
          where: { id: oppositeLike.id }
        })
      }

      // Создаем новый лайк
      return await ctx.db.characterCommentLike.create({
        data: {
          characterCommentId: input.characterCommentId,
          userId: input.userId,
          type: input.type
        }
      })
    }),

  // Получить все комментарии персонажей (для форума)
  getAllCharacterComments: publicProcedure
    .query(async ({ ctx }) => {
      return await ctx.db.characterComment.findMany({
        where: {
          parentId: { isSet: false } // Только родительские комментарии
        },
        include: {
          user: {
            select: { name: true, email: true, image: true }
          },
          character: {
            select: { name: true, image: true }
          },
          characterCommentLikes: true
        },
        orderBy: { createdAt: 'desc' }
      })
    }),

  // Получить комментарии пользователя к персонажам
  getUserCharacterComments: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input, ctx }) => {
      return await ctx.db.characterComment.findMany({
        where: {
          userId: input.userId,
          parentId: { isSet: false } // Только родительские комментарии
        },
        include: {
          user: {
            select: { name: true, email: true, image: true }
          },
          character: {
            select: { name: true, image: true }
          },
          characterCommentLikes: true
        },
        orderBy: { createdAt: 'desc' }
      })
    })
})
