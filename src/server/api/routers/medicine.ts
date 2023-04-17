import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { z } from "zod";

export const medicineRouter = createTRPCRouter({
  gets: publicProcedure.query(async ({ ctx }) => {
    const medicines = await ctx.prisma.medicine.findMany({
      where: {
        userId: ctx.session?.user.id,
      },
      select: {
        id: true,
        name: true,
      },
    });
    return medicines.map((medicine) => ({
      value: medicine.id,
      label: medicine.name,
    }));
  }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const medicine = await ctx.prisma.medicine.create({
        data: {
          name: input.name,
          userId: ctx.session.user.id,
        },
      });
      return medicine;
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
      })
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
      return medicine;
    }),
  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const medicine = await ctx.prisma.medicine.delete({
        where: {
          id: input.id,
        },
      });
      return medicine;
    }),
});
