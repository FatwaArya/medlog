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
      avatarURL: ctx.session.user.image,
      name: ctx.session.user.name,
      email: ctx.session.user.email,
      id: ctx.session.user.id,
    };

    return jwt.sign(userData, env.CANNY_PRIVATE_TOKEN, { algorithm: "HS256" });
  }),
});
