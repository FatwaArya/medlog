import { z } from "zod";
import { createTRPCRouter, adminProcedure, publicProcedure } from "../trpc";
import { env } from "@/env.mjs";
import { TRPCError } from "@trpc/server";

export const adminRouter = createTRPCRouter({
    getUserByRole: adminProcedure.query(async ({ctx}) => {
        const admins = await ctx.prisma.user.findMany({
            where: {
                role: 'admin'
            },
        });
        return admins;
    })
})