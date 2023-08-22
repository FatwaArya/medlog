import { z } from "zod";
import { createTRPCRouter, adminProcedure, publicProcedure } from "../trpc";
import { env } from "@/env.mjs";
import { TRPCError } from "@trpc/server";
import { addDays } from "date-fns";

export const adminRouter = createTRPCRouter({
  getUserByRole: adminProcedure.query(async ({ ctx }) => {
    const users = await ctx.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        isSubscribed: true,
        image: true,
        phone: true,
        Subscription: {
          select: {
            subscribedUntil: true,
          },
        },
      },
    });

    return users;
  }),
  getUserById: adminProcedure
    .input(
      z.object({
        userId: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const admin = await ctx.prisma.user.findUnique({
        where: {
          id: input.userId,
        },
        include: {
          //return true if user is subscribed to admin
          Subscription: {
            where: {
              status: "active",
            },
            select: {
              subscribedUntil: true,
            },
          },
        },
      });

      //count patient
      const patient = await ctx.prisma.patient.count({
        where: {
          userId: input.userId,
        },
      });
      //add patient count to admin
      return {
        ...admin,
        patient,
      };
    }),
  getSubsRecord: adminProcedure
    .input(
      z.object({
        userId: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const subsRecord = ctx.prisma.subscription.findMany({
        where: {
          userId: input.userId,
        },
      });
      return subsRecord;
    }),
  activateUser: adminProcedure
    .input(
      z.object({
        id: z.string(),
        plan: z.enum(["1m", "3m", "6m"]),
      }),
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
        //if user is alredy subscribed, cant subscribe again
        const user = await tx.user.findFirst({
          where: {
            id: input.id,
          },
          select: {
            isSubscribed: true,
          },
        });
        if (user?.isSubscribed) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "User is already subscribed",
          });
        }
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
            userId: input.id,
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
      }),
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
        //user is only had one subscription at a time so update the last one and set it to expired
        const subscription = await tx.subscription.findFirst({
          where: {
            userId: input.id,
          },
          orderBy: {
            subscribedUntil: "desc",
          },
        });
        await tx.subscription.update({
          where: {
            id: subscription?.id,
          },
          data: {
            subscribedUntil: addDays(new Date(), -1),
          },
        });
      });
    }),
});
