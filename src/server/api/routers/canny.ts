import { z } from "zod";
import {
  createTRPCRouter,
  protectedSubscribedProcedure,
  publicProcedure,
} from "../trpc";
import jwt from "jsonwebtoken";
import { env } from "@/env.mjs";

export const cannyRouter = createTRPCRouter({
  cannyUserToken: protectedSubscribedProcedure.query(async ({ ctx }) => {
    const userData = {
      avatarURL: ctx.user?.imageUrl,
      name: ctx.user?.firstName,
      email: ctx.user?.emailAddresses[0]?.emailAddress,
      id: ctx.user?.id,
    };

    return jwt.sign(userData, env.CANNY_PRIVATE_TOKEN, { algorithm: "HS256" });
  }),
});
