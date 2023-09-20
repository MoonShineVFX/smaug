
import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import { authRouter } from './auth';
import { assetRouter } from './asset';
import { menuRouter } from './menu';

export const appRouter = router({
  hello: publicProcedure
    .input(
      z.object({
        text: z.string(),
      }),
    )
    .query((opts) => {
      console.log(Object.keys(opts.ctx))
      return {
        greeting: `hello ${opts.input.text}`,
      };
    }),
  auth: authRouter,
  assets: assetRouter,
  menus: menuRouter,
});

export type AppRouter = typeof appRouter;