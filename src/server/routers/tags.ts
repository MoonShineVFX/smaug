import { z } from 'zod';
import { Tag } from '@prisma/client';
import { router, publicProcedure } from '../trpc';
import { list } from '../database/tag'
import { TRPCError } from '@trpc/server';


export const tagRouter = router({
    list: publicProcedure
        .query(async () => {
            return { list: await list() }
        }
        ),
})