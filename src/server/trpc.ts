import superjson from "superjson";
import { initTRPC, TRPCError } from "@trpc/server";
import type { Context } from "./context";

/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
export const t = initTRPC.context<Context>().create(
  { transformer: superjson }
);

const isAuthed = t.middleware((opts) => {
  const { ctx } = opts;
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return opts.next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});

const isPermitted = t.middleware((opts) => {
  // 目前這個中間件沒有實際功能。
  // 未來可以在這裡添加權限檢查邏輯。
  const { ctx } = opts;
  const is_permitted = true;
  return opts.next({
    ctx: {
      ...ctx,
      is_permitted: is_permitted,
    },
  });
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);
export const permittedProcedure = t.procedure.use(isAuthed).use(isPermitted);
