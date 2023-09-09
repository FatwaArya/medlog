import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

import { TRPCError } from "@trpc/server";
import { instance } from "@/server/axios";
import { type RecurringPaymentResponse } from "../interface/subscriptionEvent";
import { type AxiosResponse } from "axios";
import { getBaseUrl } from "@/utils/api";
import { clerkClient } from "@clerk/nextjs";
import ratelimit from "../helpers/rateLimiter";
import { type Logger } from "next-axiom";
import { type SubscriptionPlan } from "@prisma/client";


type RecurringResponse = AxiosResponse<RecurringPaymentResponse>;

//create axios instance with baseURL https://api.xendit.co

export const subscriptionRouter = createTRPCRouter({
  subscribe: protectedProcedure
    .input(
      z.object({
        plan: z.enum(["free", "personal", "professional"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      let redirectUrl: string | undefined;
      const { userId, log } = ctx;
      log.info("Subscription started", { input });


      try {
      const {privateMetadata, id} = await clerkClient.users.getUser(userId);
      
      if (!id || !privateMetadata) {
        log.error("User not found", { userId });
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User not found",
        });
      }

      
      const cust_id = privateMetadata?.cust_id;
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
        case "free":
          return "free plan cannot be subscribed"
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
  
        const subscription: RecurringResponse = await instance.post(
          "/recurring/plans",
          {
            reference_id: userId,
            customer_id: cust_id,
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


        log.info("Subscription created - Redirect URL:", {
          redirectUrl: subscription.data.actions[0]?.url 
        });

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
    getUserPlan: protectedProcedure
    .input(z.object({}))
    .query(async ({ ctx }) => {
      const { userId, log,plan } = ctx as {
        userId: string;
        log: Logger;
        plan: string;
      }
      log.info("User plan fetched", { plan });

      const userPlan = plan.toLowerCase() as SubscriptionPlan

      let maxPatient: string
      let maxCheckup: string

      // change max patient and max checkup based on user plan
      
      switch (userPlan) {
        case "free":
          maxPatient = "5";
          maxCheckup = "25";
          break;
        case "personal":
          maxPatient = "20";
          maxCheckup = "75";
          break;
        case "professional":
          maxPatient = "unlimited";
          maxCheckup = "unlimited";
          break;
        default:
          log.error("Invalid plan", { userPlan });  
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid plan",
          });
      }


      const result = await ctx.prisma.remainingLimit.findFirst({
        where: {
          userId: userId,
        },
      });

      log.info("User remaining usage fetched", { result });

      
      
      return {
        plan: userPlan,
        remainingPatient: result?.patientLimit,
        remainingCheckup: result?.medicalRecordLimit,
        maxPatient,
        maxCheckup,
        resetDate: result?.resetAt,
      }

    
    })
});
