import { z } from "zod";
import { createTRPCRouter, adminProcedure, publicProcedure } from "../trpc";
import { env } from "@/env.mjs";
import { TRPCError } from "@trpc/server";

export const adminRouter = createTRPCRouter({
  getUserByRole: adminProcedure.query(async ({ ctx }) => {
    const users = await ctx.prisma.user.findMany({
      where: {
        role: "user",
      },
    });
    return users;
  }),
  activateUser: adminProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.update({
        where: {
          id: input.id,
        },
        data: {
          isSubscribed: true,
        },
      });
      return user;
    }),
  deactivateUser: adminProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.update({
        where: {
          id: input.id,
        },
        data: {
          isSubscribed: false,
        },
      });
      return user;
    }),
});
