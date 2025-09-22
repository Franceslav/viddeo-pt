import { z } from "zod"
import { TRPCError } from "@trpc/server"
import { publicProcedure, router } from "../trpc"

export const characterRouter = router({
  // Получить всех персонажей
  getCharacters: publicProcedure
    .query(async ({ ctx }) => {
      return await ctx.db.character.findMany({
        where: { isActive: true },
        include: {
          characterComments: {
            include: {
              user: {
                select: { name: true, email: true, image: true }
              }
            },
            orderBy: { createdAt: 'desc' }
          }
        },
        orderBy: { name: 'asc' }
      })
    }),

  // Получить персонажа по ID
  getCharacter: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const character = await ctx.db.character.findUnique({
        where: { id: input.id },
        include: {
          characterComments: {
            include: {
              user: {
                select: { name: true, email: true, image: true }
              }
            },
            orderBy: { createdAt: 'desc' }
          }
        }
      })

      if (!character) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Character not found'
        })
      }

      return character
    }),

  // Создать персонажа (только для админов)
  createCharacter: publicProcedure
    .input(z.object({
      name: z.string().min(1, "Name is required"),
      description: z.string().min(1, "Description is required"),
      image: z.string().optional().nullable(),
      isActive: z.boolean().default(true)
    }))
    .mutation(async ({ input, ctx }) => {
      return await ctx.db.character.create({
        data: input
      })
    }),

  // Обновить персонажа (только для админов)
  updateCharacter: publicProcedure
    .input(z.object({
      id: z.string(),
      name: z.string().min(1, "Name is required").optional(),
      description: z.string().min(1, "Description is required").optional(),
      image: z.string().optional().nullable(),
      isActive: z.boolean().optional()
    }))
    .mutation(async ({ input, ctx }) => {
      const { id, ...updateData } = input

      const character = await ctx.db.character.findUnique({
        where: { id }
      })

      if (!character) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Character not found'
        })
      }

      return await ctx.db.character.update({
        where: { id },
        data: updateData
      })
    }),

  // Удалить персонажа (только для админов)
  deleteCharacter: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const character = await ctx.db.character.findUnique({
        where: { id: input.id }
      })

      if (!character) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Character not found'
        })
      }

      return await ctx.db.character.delete({
        where: { id: input.id }
      })
    }),

  // Получить комментарии к персонажу
  getCharacterComments: publicProcedure
    .input(z.object({ characterId: z.string() }))
    .query(async ({ input, ctx }) => {
      return await ctx.db.characterComment.findMany({
        where: { characterId: input.characterId },
        include: {
          user: {
            select: { name: true, email: true, image: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      })
    }),

  // Добавить комментарий к персонажу
  addCharacterComment: publicProcedure
    .input(z.object({
      characterId: z.string(),
      content: z.string().min(1, "Comment cannot be empty"),
      userId: z.string()
    }))
    .mutation(async ({ input, ctx }) => {
      // Проверяем, что персонаж существует
      const character = await ctx.db.character.findUnique({
        where: { id: input.characterId }
      })

      if (!character) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Character not found'
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

      return await ctx.db.characterComment.create({
        data: {
          content: input.content,
          userId: input.userId,
          characterId: input.characterId
        },
        include: {
          user: {
            select: { name: true, email: true, image: true }
          }
        }
      })
    }),

  // Удалить комментарий к персонажу (только автор)
  deleteCharacterComment: publicProcedure
    .input(z.object({
      commentId: z.string(),
      userId: z.string()
    }))
    .mutation(async ({ input, ctx }) => {
      const comment = await ctx.db.characterComment.findUnique({
        where: { id: input.commentId }
      })

      if (!comment) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Comment not found'
        })
      }

      if (comment.userId !== input.userId) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You can only delete your own comments'
        })
      }

      return await ctx.db.characterComment.delete({
        where: { id: input.commentId }
      })
    })
})
