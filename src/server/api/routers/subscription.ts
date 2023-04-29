import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import midtransClient from "midtrans-client";
import { env } from "@/env.mjs";

const snap = new midtransClient.Snap({
  // Set to true if you want Production Environment (accept real transaction).
  isProduction: false,
  serverKey: env.MIDTRANS_SERVER_KEY,
});

const PaymentInputSchema = z.object({
  transaction_details: z.object({
    order_id: z.string(),
    gross_amount: z.number(),
  }),
  credit_card: z.object({ secure: z.boolean() }),
  customer_details: z.object({
    first_name: z.string(),
    last_name: z.string(),
    email: z.string(),
    phone: z.string(),
  }),
});

const PaymentOutputSchema = z.object({
  token: z.string(),
  redirect_url: z.string(),
});

export const subscriptionRouter = createTRPCRouter({
  create: protectedProcedure
    // .input(PaymentInputSchema)
    // .output(PaymentOutputSchema)
    .query(async ({ ctx }) => {
      const { user } = ctx.session;
      const order_id = `order-${Date.now()}`;
      const gross_amount = 10000;
      const parameter = {
        transaction_details: {
          order_id,
          gross_amount,
        },
        credit_card: {
          secure: true,
        },
        customer_details: {
          first_name: user.name,
          email: user.email,
        },
      };
      const { token, redirect_url } = await snap.createTransaction(parameter);

      return {
        token,
        redirect_url,
      };
    }),
});
