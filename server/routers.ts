import { COOKIE_NAME } from "@shared/const";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { getSharedTrackerState, getTrackerStateByUserId, saveSharedTrackerState, saveTrackerStateForUserId } from "./db";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";

const trackerStateInput = z.object({
  invoices: z.array(z.unknown()),
  bgs: z.array(z.unknown()),
  paymentHistory: z.array(z.unknown()),
});

export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  tracker: router({
    getState: protectedProcedure.query(async ({ ctx }) => {
      return getTrackerStateByUserId(ctx.user.id);
    }),
    saveState: protectedProcedure
      .input(trackerStateInput)
      .mutation(async ({ ctx, input }) => {
        return saveTrackerStateForUserId(ctx.user.id, input);
      }),
    getSharedState: publicProcedure.query(async () => {
      return getSharedTrackerState();
    }),
    saveSharedState: publicProcedure
      .input(trackerStateInput)
      .mutation(async ({ input }) => {
        return saveSharedTrackerState(input);
      }),
  }),
});

export type AppRouter = typeof appRouter;
