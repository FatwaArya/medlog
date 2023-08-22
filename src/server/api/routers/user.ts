import { unknown, z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { instance } from "@/server/axios";
import { TRPCError } from "@trpc/server";

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
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const formattedPhoneNumber = formatPhoneNumber(input.phone);

      await ctx.prisma.$transaction(async (tx) => {
        try {
          const customer = await instance.post("/customers", {
            reference_id: ctx.user?.id,
            individual_detail: {
              given_names: ctx.user?.firstName,
            },
            email: ctx.user?.primaryEmailAddressId,
            type: "INDIVIDUAL",
            mobile_number: formattedPhoneNumber,
          });
          await tx.user.update({
            where: {
              id: ctx.user?.id,
            },
            data: {
              phone: input.phone,
              isNewUser: false,
              customer_id: customer.data.id,
            },
          });
        } catch (error) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: error.response.data.message as unknown as string,
          });
        }
      });
    }),
});
