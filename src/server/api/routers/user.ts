import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { instance } from "@/server/axios";

function formatPhoneNumber(phoneNumber: string) {
  if (phoneNumber.startsWith("0")) {
    return "+62" + phoneNumber.slice(1);
  }
  return phoneNumber;
}

export const userRouter = createTRPCRouter({
  boarding: protectedProcedure
    .input(
      z.object({
        phone: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const formattedPhoneNumber = formatPhoneNumber(input.phone);

      await ctx.prisma.$transaction(async (tx) => {
        const customer = await instance.post("/customers", {
          reference_id: ctx.session.user.id,
          individual_detail: {
            given_names: ctx.session.user.name,
          },
          email: ctx.session.user.email,
          type: "INDIVIDUAL",
          mobile_number: formattedPhoneNumber,
        });

        await tx.user.update({
          where: {
            id: ctx.session.user.id,
          },
          data: {
            phone: input.phone,
            isNewUser: false,
            customer_id: customer.data.id,
          },
        });
      });
    }),
});
