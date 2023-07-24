export interface IRecurringCycle {
  plan_id: string;
  id: string;
  reference_id: string;
  customer_id: string;
  recurring_action: string;
  type: string;
  cycle_number: number;
  attempt_count: number;
  attempt_details: {
    attempt_number: number;
    created: string;
    action_id: string;
    status: string;
    Failure_code: string | null;
    next_retry_timestamp: string | null;
  }[];
  status: string;
  scheduled_timestamp: string;
  created: string;
  updated: string;
  currency: string;
  amount: number;
  metadata: unknown | null;
}
