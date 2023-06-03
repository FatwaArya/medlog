import { z } from "zod";
import { createTRPCRouter, protectedSubscribedProcedure, publicProcedure } from "../trpc";

export const recordRouter = createTRPCRouter({
  getStatRevenue: protectedSubscribedProcedure.query(async ({ ctx }) => {
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
  getRecordById: protectedSubscribedProcedure
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
  getRecords: protectedSubscribedProcedure
    .input(
      z.object({
        patientId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const records = await ctx.prisma.medicalRecord.findMany({
        where: {
          patient: {
            id: input.patientId,
            userId: ctx.session.user.id,
          },
        },
        include: {
          patient: true,
          MedicineDetail: {
            select: {
              medicine: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      return records;
    }),
  getRecordReports: protectedSubscribedProcedure
    .input(
      z.object({
        from: z.date(),
        to: z.date(),
      })
    )
    .query(async ({ ctx, input }) => {
      const reports = await ctx.prisma.medicalRecord.findMany({
        where: {
          patient: {
            userId: ctx.session.user.id,
          },
          createdAt: {
            gte: input.from,
            lte: input.to,
          },
        },
        include: {
          patient: {
            select: {
              user: {
                select: {
                  name: true,
                },
              },
              name: true,
              address: true,
              phone: true,
            },
          },
        },
      });
      return reports;
    }),
});
