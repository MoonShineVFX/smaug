import { z } from "zod";
import { publicProcedure, router } from "../trpc";
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
    .input(z.object({ name: z.string(), parentId: z.number(), menuId: z.string()}))
    .query(async (opts) => {
      const { name, parentId, menuId } = opts.input;
      const category = await createCategory({ name, parentId, menuId });
      return { detail: category };
    }),
});
