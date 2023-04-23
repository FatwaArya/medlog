import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

const SANDBOX_URL = "https://app.sandbox.midtrans.com/snap/v1/transactions";

const createSubscription = z.object({
  name: z.string(),
  amount: z.string(),
  currency: z.string(),
  payment_type: z.string(),
  token: z.string(),
  schedule: z.object({
    interval: z.number(),
    interval_unit: z.string(),
    max_interval: z.number(),
    start_time: z.string(),
  }),
  metadata: z.object({ description: z.string() }),
  customer_details: z.object({
    first_name: z.string(),
    last_name: z.string(),
    email: z.string(),
    phone: z.string(),
  }),
  gopay: z.object({ account_id: z.string() }),
});

export const subscriptionRouter = createTRPCRouter({});
