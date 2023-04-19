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
  getRecordById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const record = await ctx.prisma.medicalRecord.findUnique({
        where: {
          id: input.id,
        },
        include: {
          patient: true,
          Attachment: {
            include: {
              File: true,
            },
          },
          MedicineDetail: {
            include: {
              medicine: true,
            },
          },
        },
      });
      return record;
    }),
  getRecords: protectedProcedure.query(async ({ ctx }) => {
    const records = await ctx.prisma.medicalRecord.findMany({
      where: {
        patient: {
          userId: ctx.session.user.id,
        },
      },
      include: {
        patient: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return records;
  }),
});
