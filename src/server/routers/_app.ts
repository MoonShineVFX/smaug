
import { z } from 'zod';
import { publicProcedure, router } from '../../server/trpc';

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
});

// Export only the type of a router!
// This prevents us from importing server code on the client.
export type AppRouter = typeof appRouter;