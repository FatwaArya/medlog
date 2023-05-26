import {
  createTRPCRouter,
  protectedSubscribedProcedure,
} from "@/server/api/trpc";
import { z } from "zod";

export const medicineRouter = createTRPCRouter({
  gets: protectedSubscribedProcedure.query(async ({ ctx }) => {
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
  create: protectedSubscribedProcedure
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
  update: protectedSubscribedProcedure
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
  delete: protectedSubscribedProcedure
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
  isMedicineRelatedToRecord: protectedSubscribedProcedure
    .input(
      z.object({
        id: z.array(z.string()),
      })
    )
    .query(async ({ ctx, input }) => {
      const medicine = await ctx.prisma.medicine.findMany({
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
      // show only unrelate medicine
      const res = medicine.filter((medicine) => {
        return medicine.MedicineDetail.length === 0;
      });

      return res;
    }),
});
