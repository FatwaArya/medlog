import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import jwt from "jsonwebtoken";
import { env } from "@/env.mjs";
import { clerkClient } from "@clerk/nextjs";
import { log } from "next-axiom";

export const cannyRouter = createTRPCRouter({
  cannyUserToken: protectedProcedure.query(async ({ ctx }) => {
    const { userId, log } = ctx;
    const user = await clerkClient.users.getUser(userId);

    const userData = {
      avatarURL: user?.imageUrl,
      name: user?.firstName,
      email: user?.emailAddresses[0]?.emailAddress,
      id: userId,
    };

    log.info("Canny user token generated", { userData });

    return jwt.sign(userData, env.CANNY_PRIVATE_TOKEN, { algorithm: "HS256" });
  }),
});
