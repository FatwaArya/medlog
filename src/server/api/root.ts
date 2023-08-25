import { createTRPCRouter } from "@/server/api/trpc";
import { patientRouter } from "./routers/patient";
import { recordRouter } from "./routers/record";
import { medicineRouter } from "./routers/medicine";
import { adminRouter } from "./routers/admin";
import { subscriptionRouter } from "./routers/subscription";
import { cannyRouter } from "./routers/canny";

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
  subscription: subscriptionRouter,
  canny: cannyRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
