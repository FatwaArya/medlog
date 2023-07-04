// export interface WebhookPayload {
//   created: string;
//   business_id: string;
//   event: WebhookEvent;
//   data: WebhookEventData;
//   api_version: string;
// }

type WebhookEvent =
  | "recurring.plan.activated"
  | "recurring.plan.inactivated"
  | "recurring.cycle.created"
  | "recurring.cycle.succeeded"
  | "recurring.cycle.retrying"
  | "recurring.cycle.failed";

interface Plan {
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

interface Schedule {
  reference_id: string;
  interval: "MONTH";
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

export interface RecurringPaymentResponse {
  id: string;
  reference_id: string;
  customer_id: string;
  recurring_action: string;
  recurring_cycle_count: number;
  currency: string;
  amount: number;
  status: string;
  created: string;
  updated: string;
  schedule_id: string;
  schedule: {
    reference_id: string;
    interval: string;
    interval_count: number;
    created: string;
    updated: string;
    anchor_date: string;
    retry_interval: string;
    retry_interval_count: number;
    total_retry: number;
    failed_attempt_notifications: number[];
  };
  immediate_action_type: string;
  notification_config: {
    recurring_created: string[];
    recurring_succeeded: string[];
    recurring_failed: string[];
    locale: string;
  };
  failed_cycle_action: string;
  metadata: null;
  description: null;
  items: null;
  actions: {
    action: string;
    url: string;
    url_type: string;
    method: string;
  }[];
  success_return_url: string;
  failure_return_url: string;
}
