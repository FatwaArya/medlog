import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const recordRouter = createTRPCRouter({
  /**
   * create medical record procedure
   *
   * this procedure only calls when user is creating new medical record for existing patient
   *
   */
  createMedicalRecord: protectedProcedure
    .input(
      z.object({
        patientId: z.string(),
        complaint: z.string(),
        diagnosis: z.string(),
        treatment: z.string(),
        note: z.string(),
        pay: z.number().min(0),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { patientId, complaint, diagnosis, treatment, note, pay } = input;
      await ctx.prisma.medicalRecord.create({
        data: {
          pay,
          patientId,
          complaint,
          diagnosis,
          treatment,
          note,
        },
      });
    }),
  getStatRevenue: protectedProcedure.query(async ({ ctx }) => {
    const result = await ctx.prisma.medicalRecord.aggregate({
      where: {
        patient: {
          userId: ctx.session.user.id,
        },
      },
      _count: true,
      _max: {
        createdAt: true,
      },
    });
    const total = result._count;
    const lastRevenue = result._max;
    return {
      total,
      lastRevenue,
    };
  }),
});
