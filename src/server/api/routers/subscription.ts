import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  protectedSubscribedProcedure,
  publicProcedure,
} from "../trpc";
import axios, { type AxiosInstance } from "axios";
import { env } from "@/env.mjs";
import { TRPCError } from "@trpc/server";

//create axios instance with baseURL https://api.xendit.co
const instance: AxiosInstance = axios.create({
  baseURL: "https://api.xendit.co",
  headers: {
    Authorization: `Basic ${Buffer.from(env.XENDIT_SERVER_KEY + ":").toString(
      "base64"
    )}`,
    "Content-Type": "application/json",
  },
});

export const subscriptionRouter = createTRPCRouter({
  subscribe: protectedProcedure
    .input(
      z.object({
        //plans 1, 3, 6, 12
        plan: z.enum(["1m", "3m", "6m"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.$transaction(async (tx) => {
          // check if user have already subscribed
          const user = await tx.user.findFirst({
            where: {
              id: ctx.session.user.id,
            },
            select: {
              isSubscribed: true,
              phone: true,
            },
          });
          if (user?.isSubscribed) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "User is already subscribed",
            });
          }
          // create customer in xendit and get customer id
          const customer = await instance.post("/customers", {
            reference_id: ctx.session.user.id,
            individual_detail: {
              given_names: ctx.session.user.name,
            },
            email: ctx.session.user.email,
            type: "INDIVIDUAL",
            mobile_number: user?.phone ?? "",
          });

          console.log(customer.data);
        });
      } catch (err) {
        console.log(err.response.data);
      }
    }),
});
