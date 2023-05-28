import { z } from "zod";
import { createTRPCRouter, adminProcedure, publicProcedure } from "../trpc";
import { env } from "@/env.mjs";
import { TRPCError } from "@trpc/server";
import { addDays } from "date-fns";

export const adminRouter = createTRPCRouter({
  getUserByRole: adminProcedure.query(async ({ ctx }) => {
    const users = await ctx.prisma.user.findMany({
      where: {
        role: "user",
      },
      select: {
        id: true,
        name: true,
        email: true,
        isSubscribed: true,
        image: true,
        phone: true,
        subscribedToAdmin: {
          select: {
            subscribedUntil: true,
          },
        },
      },
    });

    return users;
  }),
  activateUser: adminProcedure
    .input(
      z.object({
        id: z.string(),
        plan: z.enum(["1m", "3m", "6m"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      let addedDays = 0;

      switch (input.plan) {
        case "1m":
          addedDays = 30;
          break;
        case "3m":
          addedDays = 90;
          break;
        case "6m":
          addedDays = 180;
          break;
      }

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
            subscribedUntil: addDays(new Date(), addedDays),
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
