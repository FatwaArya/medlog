import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { v4 as uuidv4 } from "uuid";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import midtransClient from "midtrans-client";
import { env } from "@/env.mjs";
import axios from "axios";
import { CreateCustomerRequest, CustomerResponse } from "../interface/customer";

const snap = new midtransClient.Snap({
  // Set to true if you want Production Environment (accept real transaction).
  isProduction: false,
  serverKey: env.MIDTRANS_SERVER_KEY,
});

const xenditInstance = axios.create({
  baseURL: "https://api.xendit.co",
  headers: {
    Authorization: `Basic ${Buffer.from(env.XENDIT_SERVER_KEY + ":").toString(
      "base64"
    )}`,
  },
});

async function getCustomerData(userId: string): Promise<CustomerResponse> {
  const { data } = await xenditInstance.get<CustomerResponse>(
    `/customers/${userId}`
  );
  return data;
}

export const subscriptionRouter = createTRPCRouter({
  create: protectedProcedure
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
  createRecurring: protectedProcedure.mutation(async ({ ctx }) => {
    const { user } = ctx.session;
    let url = "";

    await ctx.prisma.$transaction(async (tx) => {
      //check if customerId exist on user table
      const customer = await tx.user.findUnique({
        where: {
          id: user.id,
        },
        select: {
          customerId: true,
        },
      });

      if (!customer?.customerId) {
        const resCus = await xenditInstance.post<CustomerResponse>(
          "/customers",
          {
            reference_id: user.id,
            type: "INDIVIDUAL",
            email: user.email,
            individual_detail: {
              given_names: user.name,
            },
          }
        );
        console.log(resCus.data.id);
        await tx.user.update({
          where: {
            id: user.id,
          },
          data: {
            customerId: resCus.data.id,
          },
        });
      }

      const plans = await xenditInstance.post("/recurring/plans", {
        reference_id: user.id,
        customer_id: customer?.customerId,
        recurring_action: "PAYMENT",
        currency: "IDR",
        amount: 100000,
        schedule: {
          reference_id: "test_reference_id",
          interval: "MONTH",
          interval_count: 1,
          anchor_date: new Date().toISOString(),
          retry_interval: "DAY",
          retry_interval_count: 3,
          total_retry: 3,
          failed_attempt_notifications: [1, 3],
        },
        immediate_action_type: "FULL_AMOUNT",
        notification_config: {
          recurring_created: ["EMAIL"],
          recurring_succeeded: ["EMAIL"],
          recurring_failed: ["EMAIL"],
        },
        failed_cycle_action: "STOP",
        metadata: null,
        success_return_url: "https://www.xendit.co/successisthesumoffailures",
        failure_return_url: "https://www.xendit.co/failureisthemotherofsuccess",
      });

      url = plans.data.actions[0].url;
    });

    return {
      message: "success",
      redirect_url: url,
    };
  }),
});
