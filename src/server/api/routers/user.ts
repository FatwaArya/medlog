import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  boarding: protectedProcedure
    .input(
      z.object({
        phone: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          phone: input.phone,
          isNewUser: false,
        },
      });

      return user;
    }),
});
