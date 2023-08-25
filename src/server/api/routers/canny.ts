import { z } from "zod";
import {
  createTRPCRouter,
  protectedSubscribedProcedure,
  publicProcedure,
} from "../trpc";
import jwt from "jsonwebtoken";
import { env } from "@/env.mjs";
import { clerkClient } from "@clerk/nextjs";

export const cannyRouter = createTRPCRouter({
  cannyUserToken: protectedSubscribedProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;
    const user = await clerkClient.users.getUser(userId);

    const userData = {
      avatarURL: user?.imageUrl,
      name: user?.firstName,
      email: user?.emailAddresses[0]?.emailAddress,
      id: userId,
    };

    return jwt.sign(userData, env.CANNY_PRIVATE_TOKEN, { algorithm: "HS256" });
  }),
});
