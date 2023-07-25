import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  protectedSubscribedProcedure,
  publicProcedure,
} from "../trpc";

import { TRPCError } from "@trpc/server";
import { instance } from "@/server/axios";
import { type RecurringPaymentResponse } from "../interface/subscriptionEvent";
import { type AxiosResponse } from "axios";

type RecurringResponse = AxiosResponse<RecurringPaymentResponse>;

//create axios instance with baseURL https://api.xendit.co

export const subscriptionRouter = createTRPCRouter({
  subscribe: protectedProcedure
    .input(
      z.object({
        plan: z.enum(["beginner", "personal", "professional"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      let redirectUrl: string | undefined;
      await ctx.prisma.$transaction(async (tx) => {
        // check if user have already subscribed
        const user = await tx.user.findFirst({
          where: {
            id: ctx.session.user.id,
          },
          select: {
            id: true,
            customer_id: true,
            isSubscribed: true,
            phone: true,
          },
        });

        if (!user) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "User not found",
          });
        }

        if (user?.isSubscribed) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "User is already subscribed",
          });
        }

        const interval: "MONTH" | "DAY" = "MONTH";
        let intervalCount = 1;
        let totalRecurrence: number | undefined;
        let anchorDate: string | undefined;
        let retryInterval: "DAY" | undefined;
        let retryIntervalCount: number | undefined;
        let totalRetry: number | undefined;
        let failedAttemptNotifications: number[] | undefined;
        let amount: number | undefined;

        // Set schedule properties based on the input plan
        switch (input.plan) {
          case "beginner":
            intervalCount = 1;
            amount = 35000;
            anchorDate = new Date().toISOString();
            break;
          case "personal":
            intervalCount = 1;
            amount = 65000;
            anchorDate = new Date().toISOString();
            break;
          case "professional":
            intervalCount = 1;
            amount = 150000;
            anchorDate = new Date().toISOString();
            break;

          default:
            // Invalid plan
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "Invalid plan",
            });
        }
        // create subscription
        const subscription: RecurringResponse = await instance.post(
          "/recurring/plans",
          {
            reference_id: user.id,
            customer_id: user.customer_id,
            recurring_action: "PAYMENT",
            currency: "IDR",
            amount: 13579,
            schedule: {
              reference_id: user.id,
              interval,
              interval_count: intervalCount,
              total_recurrence: totalRecurrence,
              anchor_date: anchorDate,
              retry_interval: retryInterval,
              retry_interval_count: retryIntervalCount,
              total_retry: totalRetry,
              failed_attempt_notifications: failedAttemptNotifications,
            },
            immediate_action_type: "FULL_AMOUNT",
            notification_config: {
              locale: "id",
              recurring_created: ["WHATSAPP"],
              recurring_succeeded: ["WHATSAPP"],
              recurring_failed: ["WHATSAPP"],
            },
            failed_cycle_action: "STOP",
            metadata: {
              plan: input.plan,
            },
            // success_return_url: "http://localhost:3000/dashboard/home",
            // failure_return_url: "http://localhost:3000/subscription",
          },
        );
        redirectUrl = subscription.data.actions[0]?.url;
      });

      if (!redirectUrl) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Failed to create subscription",
        });
      }

      return redirectUrl;
    }),
});
