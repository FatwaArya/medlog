import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const recordRouter = createTRPCRouter({
  getStatRevenue: protectedProcedure.query(async ({ ctx }) => {
    const result = await ctx.prisma.medicalRecord.aggregate({
      where: {
        patient: {
          userId: ctx.session.user.id,
        },
      },
      _sum: {
        pay: true,
      },
      _max: {
        createdAt: true,
      },
    });
    const total = result._sum.pay;
    const lastRevenue = result._max;
    return {
      total,
      lastRevenue,
    };
  }),
});
