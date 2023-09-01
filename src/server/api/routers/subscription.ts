import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

import { TRPCError } from "@trpc/server";
import { instance } from "@/server/axios";
import { type RecurringPaymentResponse } from "../interface/subscriptionEvent";
import { type AxiosResponse } from "axios";
import { getBaseUrl } from "@/utils/api";
import { clerkClient } from "@clerk/nextjs";

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
      const { userId, isSubscribed, log } = ctx;
      const user = await clerkClient.users.getUser(userId);

      if (!userId) {
        log.error("User not found", { userId });
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User not found",
        });
      }

      if (isSubscribed) {
        log.error("User is already subscribed", { userId });
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
          log.error("Invalid plan", { input });
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid plan",
          });
      }
      // create subscription
      try {
        const subscription: RecurringResponse = await instance.post(
          "/recurring/plans",
          {
            reference_id: userId,
            customer_id: user.privateMetadata.customer_id,
            recurring_action: "PAYMENT",
            currency: "IDR",
            amount: 13579,
            schedule: {
              reference_id: userId,
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
            //check if vercel url is available if yess put success url and failure url
            ...(process.env.VERCEL_URL && {
              success_return_url: `${getBaseUrl()}/dashboard/home`,
            }),
          },
        );
        redirectUrl = subscription.data.actions[0]?.url;

        log.info("Subscription created", { subscription });

        if (!redirectUrl) {
          log.error("Failed to create subscription", { subscription });
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Failed to create subscription",
          });
        }
      } catch (error) {
        log.error("Failed to create subscription", { error });
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Failed to create subscription",
        });
      }
      return redirectUrl;
    }),
});
