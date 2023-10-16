import { z } from 'zod';
import { publicProcedure, protectedProcedure, router } from '../trpc';
import { listByCategory, create as createAsset } from '../database/asset';
import { assetDetail } from '../api/asset';

export const assetRouter = router({
  get: publicProcedure
    .input(z.object({ assetId: z.string() }))
    .query(async (opts) => {
      const { assetId } = opts.input
      const asset = await assetDetail(assetId)
      return { detail: asset }
    }),

  list: publicProcedure
    .input(z.object({ categoryId: z.number() }))
    .query(async (opts) => {
      const { categoryId } = opts.input
      const assets = await listByCategory(categoryId)
      return { list: assets }
    }),

  create: protectedProcedure
    .input(z.object({
      name: z.string(),
      categoryId: z.number(),
      tags: z.array(z.string()),
    }))
    .mutation(async (opts) => {
      const creatorId = opts.ctx.user.id
      const { name, categoryId, tags } = opts.input
      const asset = await createAsset({ name, categoryId, tags, creatorId })
      return { asset }
    })
})

