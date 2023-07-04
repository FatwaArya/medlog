export interface IRecurringPlan {
  schedule_timestamp: string;
  id: string;
  reference_id: string;
  customer_id: string;
  recurring_action: "PAYMENT";
  recurring_cycle_count: number;
  currency: string;
  amount: number;
  status: "ACTIVE" | "INACTIVE";
  created: string;
  updated: string;
  payment_methods: PaymentMethod[];
  schedule_id: string;
  schedule: Schedule;
  immediate_action_type: "FULL_AMOUNT";
  notification_config: NotificationConfig;
  failed_cycle_action: "STOP";
  metadata: Record<string, any>;
  description: string;
  items: Item[];
  actions: Action[];
  success_return_url: string;
  failure_return_url: string;
}

interface PaymentMethod {
  payment_method_id: string;
  rank: number;
  type: "EWALLET";
}

export interface Schedule {
  reference_id: string;
  interval: "MONTH" | "DAY" | "WEEK" | "YEAR";
  interval_count: number;
  created: string;
  updated: string;
  total_recurrence: number;
  anchor_date: string;
  retry_interval: "DAY";
  retry_interval_count: number;
  total_retry: number;
  failed_attempt_notifications: number[];
}

interface NotificationConfig {
  recurring_created: ("WHATSAPP" | "EMAIL")[];
  recurring_succeeded: ("WHATSAPP" | "EMAIL")[];
  recurring_failed: ("WHATSAPP" | "EMAIL")[];
  locale: "id";
}

interface Item {
  type: "DIGITAL_PRODUCT";
  name: string;
  net_unit_amount: number;
  quantity: number;
}

interface Action {
  action: "AUTH";
  url: string;
  url_type: "WEB";
  method: "GET";
}
