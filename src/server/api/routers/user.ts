import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { env } from "@/env.mjs";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export const userRouter = createTRPCRouter({
  register: publicProcedure
    .input(
      z.object({
        phone: z.string(),
        email: z.string(),
        password: z
          .string()
          .min(8, {
            message: "Password harus memiliki minimal 8 karakter",
          })
          .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {
            message:
              "Password harus mengandung huruf besar, huruf kecil, dan angka",
          }),
        name: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existedUser = await ctx.prisma.user.findUnique({
        where: {
          email: input.email,
        },
      });

      if (existedUser) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Email sudah terdaftar",
        });
      }

      const salt = bcrypt.genSaltSync(SALT_ROUNDS);
      const hash = bcrypt.hashSync(input.password, salt);

      const user = await ctx.prisma.user.create({
        data: {
          email: input.email,
          phone: input.phone,
          password: hash,
          name: input.name,
        },
      });
      return {
        status: 201,
        message: "Account created successfully",
        result: user.email,
      };
    }),
});
