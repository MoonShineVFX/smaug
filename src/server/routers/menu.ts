import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { get, detail } from '../database/menu'
import { menuTree } from '../database/menuTree'
import { TRPCError } from '@trpc/server';

export const menuRouter = router({

  all: publicProcedure.query(async () => {
    return { menus: await get() }
  }),

  detail: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async (opts) => {
      const { id } = opts.input
      return { detail: await detail(id) }
    }),

  categories: publicProcedure
    .input(z.object({ menuId: z.string() }))
    .query(async (opts) => {
      const { menuId } = opts.input
      try {
        return { menuTree: await menuTree(menuId) }
      }
      catch (err) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: (err as Error).message,
        })
      }
    }),
})

