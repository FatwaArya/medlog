import { createTRPCRouter } from "@/server/api/trpc";
import { patientRouter } from "./routers/patient";
import { recordRouter } from "./routers/record";
import { medicineRouter } from "./routers/medicine";
import { adminRouter } from "./routers/admin";
import { userRouter } from "./routers/user";
import { subscriptionRouter } from "./routers/subscription";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  patient: patientRouter,
  record: recordRouter,
  medicine: medicineRouter,
  admin: adminRouter,
  user: userRouter,
  subscription: subscriptionRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
