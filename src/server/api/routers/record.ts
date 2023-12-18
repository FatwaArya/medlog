import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { clerkClient } from "@clerk/nextjs";
import { report } from "process";

export const recordRouter = createTRPCRouter({
  getStatRevenue: protectedProcedure.query(async ({ ctx }) => {
    const { userId, log } = ctx;

    const result = await ctx.prisma.medicalRecord.aggregate({
      where: {
        patient: {
          userId: userId,
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

    log.info("Revenue fetched", { total, lastRevenue });
    return {
      total,
      lastRevenue,
    };
  }),
  getRecordById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
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
      ctx.log.info("Record fetched", { record });

      return record;
    }),
  getRecords: protectedProcedure
    .input(
      z.object({
        patientId: z.string(),
        //create pagination and sorting
        page: z.number().default(1),
        limit: z.number().default(10),
        sortBy: z.string().default("createdAt"),
        sortDirection: z.enum(["asc", "desc"]).default("desc"),
      }),
    )

    .query(async ({ ctx, input }) => {
      const { userId, log } = ctx;
      const { page, limit, sortBy, sortDirection } = input;

      const records = await ctx.prisma.medicalRecord.findMany({
        where: {
          patient: {
            id: input.patientId,
            userId: userId,
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
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          [sortBy]: sortDirection,
        },
      });
       
      const total = await ctx.prisma.medicalRecord.count({
        where: {
          patient: {
            id: input.patientId,
            userId: userId,
          },
        },
      });

      log.info("Records fetched", { records, total });

      return {
        data: records,
        meta: {
          total,
          page,
          limit,
          hasMore: page * limit < total,
        },
      };
    }),
  getRecordReports: protectedProcedure
    .input(
      z.object({
        from: z.date(),
        to: z.date(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { userId, log } = ctx;
      const { firstName, lastName } = await clerkClient.users.getUser(userId);
      const fullName = `${firstName} ${lastName}`;

      const reports = await ctx.prisma.medicalRecord.findMany({
        where: {
          patient: {
            userId,
          },
          createdAt: {
            gte: input.from,
            lte: input.to,
          },
        },
        include: {
          patient: {
            select: {
              name: true,
              address: true,
              phone: true,
            },
          },
        },
      });

      const reportsWithFullName = reports.map((report) => {
        return {
          ...report,
          fullName: fullName,
        };
      });

      log.info("Reports fetched", { reportsWithFullName });

      return reportsWithFullName;
    }),
});
