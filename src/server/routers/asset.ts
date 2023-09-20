import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import { listByCatrgory } from '../database/asset';
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
      const assets = await listByCatrgory(categoryId)
      return { list: assets }
    })
}) 
