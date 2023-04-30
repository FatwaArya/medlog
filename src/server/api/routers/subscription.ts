import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { v4 as uuidv4 } from "uuid";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import midtransClient from "midtrans-client";
import { env } from "@/env.mjs";

const snap = new midtransClient.Snap({
  // Set to true if you want Production Environment (accept real transaction).
  isProduction: false,
  serverKey: env.MIDTRANS_SERVER_KEY,
});

export const subscriptionRouter = createTRPCRouter({
  create: protectedProcedure
    // .input(PaymentInputSchema)
    // .output(PaymentOutputSchema)
    .query(async ({ ctx }) => {
      const { user } = ctx.session;

      const order_id = `order-${uuidv4().substring(0, 8)}`;
      const gross_amount = 10000;
      const parameter = {
        transaction_details: {
          order_id,
          gross_amount,
        },
        credit_card: {
          secure: true,
          save_card: true,
        },
        customer_details: {
          first_name: user.name,
          email: user.email,
        },
        user_id: user.id,
      };
      const { token, redirect_url } = await snap.createTransaction(parameter);
      await ctx.prisma.payment.create({
        data: {
          orderId: order_id,
          userId: user.id,
        },
      });
      return {
        token,
        redirect_url,
      };
    }),
});
