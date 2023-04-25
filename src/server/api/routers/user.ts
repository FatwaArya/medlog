import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { env } from "@/env.mjs";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;


export const userRouter = createTRPCRouter({
    register: publicProcedure.input(z.object({
        email: z.string(),
        password: z.string(),
        name: z.string(),
    })).mutation(async ({ ctx, input }) => {

        const existedUser = await ctx.prisma.user.findUnique({
            where: {
                email: input.email
            }
        })

        if (existedUser) {
            throw new TRPCError({
                code: "CONFLICT",
                message: "User already exists.",
              });        }

              const salt = bcrypt.genSaltSync(SALT_ROUNDS);
              const hash = bcrypt.hashSync(input.password, salt);


        const user = await ctx.prisma.user.create({
            data: {
                email: input.email,
                password: hash,
                name: input.name,
            }
        })
        return {
            status: 201,
            message: "Account created successfully",
            result: user.email,
          }
        }
    ),

})