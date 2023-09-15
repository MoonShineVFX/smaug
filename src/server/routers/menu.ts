import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { get, detail} from  '../database/menu'

export const menuRouter = router({
    
    all: publicProcedure.query(async () =>{
        return {list: await get()}
    }),

    detail: publicProcedure
    .input(z.object({id: z.string()}))
    .query(async (opts) =>{
        const {id} = opts.input
        return {detail: await detail(id)}
    })
})

