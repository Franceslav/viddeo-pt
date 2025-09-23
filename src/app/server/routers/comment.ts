import { z } from "zod"
import { TRPCError } from "@trpc/server"
import { publicProcedure, router } from "../trpc"

export const commentRouter = router({
  // Получить все комментарии
  getAllComments: publicProcedure
    .query(async ({ ctx }) => {
      // Получаем комментарии к эпизодам
      const episodeComments = await ctx.db.comment.findMany({
        where: {
          parentId: { isSet: false } // Только родительские комментарии
        },
        include: {
          user: {
            select: { name: true, email: true, image: true }
          },
          episode: {
            include: {
              season: {
                select: { title: true, seasonNumber: true }
              }
            }
          },
          commentLikes: true,
          replies: {
            include: {
              user: {
                select: { name: true, email: true, image: true }
              },
              commentLikes: true
            },
            orderBy: { createdAt: 'asc' }
          }
        },
        orderBy: { createdAt: 'desc' }
      })

      // Получаем комментарии к персонажам
      const characterComments = await ctx.db.characterComment.findMany({
        where: {
          parentId: { isSet: false } // Только родительские комментарии
        },
        include: {
          user: {
            select: { name: true, email: true, image: true }
          },
          character: {
            select: { name: true, image: true, id: true }
          },
          characterCommentLikes: true,
          replies: {
            include: {
              user: {
                select: { name: true, email: true, image: true }
              },
              characterCommentLikes: true
            },
            orderBy: { createdAt: 'asc' }
          }
        },
        orderBy: { createdAt: 'desc' }
      })

      // Объединяем и сортируем все комментарии
      const allComments = [
        ...episodeComments.map(comment => ({
          ...comment,
          type: 'episode' as const,
          commentLikes: comment.commentLikes,
          replies: comment.replies.map(reply => ({
            ...reply,
            commentLikes: reply.commentLikes
          }))
        })),
        ...characterComments.map(comment => ({
          ...comment,
          type: 'character' as const,
          commentLikes: comment.characterCommentLikes,
          replies: comment.replies.map(reply => ({
            ...reply,
            commentLikes: reply.characterCommentLikes
          }))
        }))
      ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

      return allComments
    }),

  // Получить комментарии к эпизоду
  getComments: publicProcedure
    .input(z.object({ episodeId: z.string() }))
    .query(async ({ input, ctx }) => {
      return await ctx.db.comment.findMany({
        where: { 
          episodeId: input.episodeId,
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
              commentLikes: true,
              replies: {
                include: {
                  user: {
                    select: { name: true, email: true, image: true }
                  },
                  commentLikes: true
                },
                orderBy: { createdAt: 'asc' }
              }
            },
            orderBy: { createdAt: 'asc' }
          },
          commentLikes: true
        },
        orderBy: { createdAt: 'desc' }
      })
    }),

  // Добавить комментарий к эпизоду
  addComment: publicProcedure
    .input(z.object({ 
      episodeId: z.string(),
      content: z.string().min(1, "Comment cannot be empty"),
      userId: z.string(),
      parentId: z.string().optional()
    }))
    .mutation(async ({ input, ctx }) => {
      // Проверяем, что эпизод существует
      const episode = await ctx.db.episode.findUnique({
        where: { id: input.episodeId }
      })

      if (!episode) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Episode not found'
        })
      }

      // Проверяем, что пользователь существует
      const user = await ctx.db.user.findUnique({
        where: { id: input.userId }
      })

      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found'
        })
      }

      // Если это ответ на комментарий, проверяем что родительский комментарий существует
      if (input.parentId) {
        const parentComment = await ctx.db.comment.findUnique({
          where: { id: input.parentId }
        })

        if (!parentComment) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Parent comment not found'
          })
        }
      }

      return await ctx.db.comment.create({
        data: {
          content: input.content,
          userId: input.userId,
          episodeId: input.episodeId,
          parentId: input.parentId
        },
        include: {
          user: {
            select: { name: true, email: true, image: true }
          },
          commentLikes: true
        }
      })
    }),

  // Получить комментарии пользователя
  getUserComments: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input, ctx }) => {
      return await ctx.db.comment.findMany({
        where: { 
          userId: input.userId,
          parentId: { isSet: false } // Только родительские комментарии
        },
        include: {
          user: {
            select: { name: true, email: true, image: true }
          },
          episode: {
            include: {
              season: {
                select: { title: true, seasonNumber: true }
              }
            }
          },
          commentLikes: true
        },
        orderBy: { createdAt: 'desc' }
      })
    }),

  // Удалить комментарий (только автор)
  deleteComment: publicProcedure
    .input(z.object({ 
      id: z.string()
    }))
    .mutation(async ({ input, ctx }) => {
      const comment = await ctx.db.comment.findUnique({
        where: { id: input.id }
      })

      if (!comment) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Comment not found'
        })
      }

      // TODO: Add authorization check (only author or admin can delete)
      // For now, assuming client-side check or simple authorization
      return await ctx.db.comment.delete({
        where: { id: input.id }
      })
    }),

      // Лайк/дизлайк комментария к эпизоду
      likeComment: publicProcedure
        .input(z.object({
          commentId: z.string(),
          userId: z.string(),
          type: z.enum(['like', 'dislike'])
        }))
        .mutation(async ({ input, ctx }) => {
          // Проверяем, что комментарий существует
          const comment = await ctx.db.comment.findUnique({
            where: { id: input.commentId }
          })

          if (!comment) {
            throw new TRPCError({
              code: 'NOT_FOUND',
              message: 'Comment not found'
            })
          }

          // Проверяем, что пользователь существует
          const user = await ctx.db.user.findUnique({
            where: { id: input.userId }
          })

          if (!user) {
            throw new TRPCError({
              code: 'NOT_FOUND',
              message: 'User not found'
            })
          }

          // Ищем существующий лайк
          const existingLike = await ctx.db.commentLike.findUnique({
            where: {
              userId_commentId: {
                userId: input.userId,
                commentId: input.commentId
              }
            }
          })

          if (existingLike) {
            if (existingLike.type === input.type) {
              // Удаляем лайк если он того же типа
              return await ctx.db.commentLike.delete({
                where: { id: existingLike.id }
              })
            } else {
              // Обновляем тип лайка
              return await ctx.db.commentLike.update({
                where: { id: existingLike.id },
                data: { type: input.type }
              })
            }
          } else {
            // Создаем новый лайк
            return await ctx.db.commentLike.create({
              data: {
                userId: input.userId,
                commentId: input.commentId,
                type: input.type
              }
            })
          }
        }),

      // Лайк/дизлайк комментария к персонажу
      likeCharacterComment: publicProcedure
        .input(z.object({
          commentId: z.string(),
          userId: z.string(),
          type: z.enum(['like', 'dislike'])
        }))
        .mutation(async ({ input, ctx }) => {
          // Проверяем, что комментарий существует
          const comment = await ctx.db.characterComment.findUnique({
            where: { id: input.commentId }
          })

          if (!comment) {
            throw new TRPCError({
              code: 'NOT_FOUND',
              message: 'Character comment not found'
            })
          }

          // Проверяем, что пользователь существует
          const user = await ctx.db.user.findUnique({
            where: { id: input.userId }
          })

          if (!user) {
            throw new TRPCError({
              code: 'NOT_FOUND',
              message: 'User not found'
            })
          }

          // Ищем существующий лайк
          const existingLike = await ctx.db.characterCommentLike.findUnique({
            where: {
              userId_characterCommentId: {
                userId: input.userId,
                characterCommentId: input.commentId
              }
            }
          })

          if (existingLike) {
            if (existingLike.type === input.type) {
              // Удаляем лайк если он того же типа
              return await ctx.db.characterCommentLike.delete({
                where: { id: existingLike.id }
              })
            } else {
              // Обновляем тип лайка
              return await ctx.db.characterCommentLike.update({
                where: { id: existingLike.id },
                data: { type: input.type }
              })
            }
          } else {
            // Создаем новый лайк
            return await ctx.db.characterCommentLike.create({
              data: {
                userId: input.userId,
                characterCommentId: input.commentId,
                type: input.type
              }
            })
          }
        })
})
