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
      await ctx.prisma.$transaction(async (tx) => {
        await tx.user.update({
          where: {
            id: input.id,
          },
          data: {
            isSubscribed: true,
          },
        });
        await tx.subscription.create({
          data: {
            subscriberId: input.id,
            adminId: ctx.session?.user.id,
            status: "active",
          },
        });
      });
    }),
  deactivateUser: adminProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.$transaction(async (tx) => {
        await tx.user.update({
          where: {
            id: input.id,
          },
          data: {
            isSubscribed: false,
          },
        });
        await tx.subscription.create({
          data: {
            subscriberId: input.id,
            adminId: ctx.session?.user.id,
            status: "inactive",
          },
        });
      });
    }),
});
