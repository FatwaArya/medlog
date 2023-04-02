import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import dayjs from "dayjs";

import relativeTime from "dayjs/plugin/relativeTime";
import localeData from "dayjs/plugin/localeData";
dayjs.extend(localeData);

export const patientRouter = createTRPCRouter({
  /**
   * create new patient procedure
   *
   * this procedure only calls when user is registering new patient for the first time
   *
   */
  createNewPatient: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        phone: z.string().min(10).max(10),
        gender: z.enum(["male", "female"]),
        address: z.string(),
        nik: z.string().min(16).max(16),
        age: z.number().min(1).max(120),
        complaint: z.string(),
        diagnosis: z.string(),
        treatment: z.string(),
        note: z.string(),
        pay: z.number().min(0),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const {
        name,
        phone,
        gender,
        address,
        age,
        complaint,
        diagnosis,
        treatment,
        note,
        pay,
        nik,
      } = input;
      //Encrypt NIK

      await ctx.prisma.$transaction(async (tx) => {
        const { id } = await tx.patient.create({
          data: {
            name,
            phone,
            gender,
            address,
            NIK: nik,
            age,
            userId: ctx.session.user.id,
          },
        });
        await tx.medicalRecord.create({
          data: {
            pay,
            patientId: id,
            complaint,
            diagnosis,
            treatment,
            note,
          },
        });
      });
    }),
  getAllPatients: protectedProcedure.query(async ({ ctx }) => {
    const result = await ctx.prisma.patient.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
    return result;
  }),
  getStatPatients: protectedProcedure.query(async ({ ctx }) => {
    const result = await ctx.prisma.patient.aggregate({
      where: {
        userId: ctx.session.user.id,
      },
      _count: true,
      _max: {
        createdAt: true,
      },
    });
    const total = result._count;
    const lastPatient = result._max;
    return {
      total,
      lastPatient,
    };
  }),
  getStatLine: protectedProcedure.query(async ({ ctx }) => {
    const result = await ctx.prisma.patient.groupBy({
      by: ["gender", "createdAt"],
      where: {
        userId: ctx.session.user.id,
      },
      _count: true,
    });

    return result.map((item) => {
      return {
        date: dayjs(item.createdAt).format("MMM"),
        Male: item.gender === "male" ? item._count : 0,
        Female: item.gender === "female" ? item._count : 0,
      };
    });
  }),
});
