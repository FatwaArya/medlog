import { type IRecurringPlan } from "@/server/api/interface/recurring/plan";
import { type IRecurringCycle } from "@/server/api/interface/recurring/cycle";

type recurringPlanEvent =
  | "recurring.plan.activated"
  | "recurring.plan.inactivated";

type recurringCycleEvent =
  | "recurring.cycle.created"
  | "recurring.cycle.succeeded"
  | "recurring.cycle.retrying"
  | "recurring.cycle.failed";

export interface RecurringPlanPayload {
  created: string;
  business_id: string;
  event: recurringPlanEvent;
  data: IRecurringPlan;
  api_version: string;
}

export interface RecurringCyclePayload {
  created: string;
  business_id: string;
  event: recurringCycleEvent;
  data: IRecurringCycle;
  api_version: string;
}
