import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import { assetDetail } from '../api/asset';

export const assetRouter = router({
  get: publicProcedure
    .input(z.object({ assetId: z.string() }))
    .query(async (opts) => {
      const { assetId } = opts.input
      const asset = await assetDetail(assetId)
      return asset
    }),
})
