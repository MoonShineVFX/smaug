import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../trpc";
import { get, list, categoryTree, createCategory } from "../database/category";

export const categoryRouter = router({
  list: publicProcedure.query(async (opts) => {
    const categories = await list();
    return { list: categories };
  }),

  get: publicProcedure
    .input(z.object({ categoryId: z.number() }))
    .query(async (opts) => {
      const { categoryId } = opts.input;
      const category = await get(categoryId);
      return { detail: category };
    }),

  tree: publicProcedure
    .input(z.object({ categoryId: z.number() }))
    .query(async (opts) => {
      const { categoryId } = opts.input;
      const category = await categoryTree(categoryId);
      return { detail: category };
    }),
  create: publicProcedure
    .input(z.object({ name: z.string(), menuId: z.string(), parentId: z.number().optional() }))
    .mutation(async (opts) => {
      const { name, menuId, parentId } = opts.input;
      const category = await createCategory(name, menuId, parentId,);
      return { detail: category };
    }),
});
