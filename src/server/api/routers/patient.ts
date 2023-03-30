import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";

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
      } = input;
      await ctx.prisma.$transaction(async (tx) => {
        const { id } = await tx.patient.create({
          data: {
            name,
            phone,
            gender,
            address,
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
});
