import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";

export const medicineRouter = createTRPCRouter({
  gets: protectedProcedure.query(async ({ ctx }) => {
    const { userId, log } = ctx;

    const medicines = await ctx.prisma.medicine.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
        name: true,
      },
    });

    log.info("Medicines fetched", { medicines });

    return medicines.map((medicine) => ({
      value: medicine.id,
      label: medicine.name,
    }));
  }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, log } = ctx;

      const medicine = await ctx.prisma.medicine.create({
        data: {
          name: input.name,
          userId,
        },
      });

      log.info("Medicine created", { medicine });

      return medicine;
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const medicine = await ctx.prisma.medicine.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
        },
      });
      ctx.log.info("Medicine updated", { medicine });

      return medicine;
    }),
  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const medicine = await ctx.prisma.medicine.delete({
        where: {
          id: input.id,
        },
      });
      ctx.log.info("Medicine deleted", { medicine });

      return medicine;
    }),
  isMedicineRelatedToRecord: protectedProcedure
    .input(
      z.object({
        id: z.array(z.string()),
      }),
    )
    .query(async ({ ctx, input }) => {
      const medicine = await ctx.boostedPrisma.medicine.findMany({
        where: {
          id: {
            in: input.id,
          },
        },
        include: {
          MedicineDetail: {
            select: {
              id: true,
            },
          },
        },
      });

      ctx.log.info("Medicine fetched", { medicine });

      // show only unrelate medicine
      const res = medicine.filter((medicine) => {
        return medicine.MedicineDetail.length === 0;
      });

      ctx.log.info("Medicine filtered", { res });

      return res;
    }),
});
