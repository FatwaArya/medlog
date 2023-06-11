import { type NextApiRequest, type NextApiResponse } from "next";
import { type WebhookPayload } from "@/server/api/interface/subscriptionEvent";
import { prisma } from "@/server/db";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const payload: WebhookPayload = req.body; // Assuming the webhook payload is sent in the request body

    // Handle the webhook event based on the event type
    switch (payload.event) {
      case "recurring.plan.activated":
        handlePlanActivatedEvent(payload.data);
        break;
      case "recurring.plan.inactivated":
        handlePlanInactivatedEvent(payload.data);
        break;
      case "recurring.cycle.created":
        handleCycleCreatedEvent(payload.data);
        break;
      case "recurring.cycle.succeeded":
        handleCycleSucceededEvent(payload.data);
        break;
      case "recurring.cycle.retrying":
        handleCycleRetryingEvent(payload.data);
        break;
      case "recurring.cycle.failed":
        handleCycleFailedEvent(payload.data);
        break;
      default:
        // Unsupported event type
        throw new Error(`Unsupported event type: ${payload.event}`);
    }

    // Send a success response
    res.status(200).json({ success: true });
  } catch (error) {
    // Handle any errors that occur during webhook processing
    console.error("Error handling webhook:", error);
    res.status(500).json({ error: "Webhook processing failed" });
  }
}

// Handler functions for each webhook event type
function handlePlanActivatedEvent(data: WebhookPayload["data"]) {
  // Handle recurring.plan.activated event

  console.log("Plan activated:", data);
  // Perform necessary actions based on the event data
}

function handlePlanInactivatedEvent(data: WebhookPayload["data"]) {
  // Handle recurring.plan.inactivated event
  console.log("Plan inactivated:", data);
  // Perform necessary actions based on the event data
}

function handleCycleCreatedEvent(data: WebhookPayload["data"]) {
  // Handle recurring.cycle.created event
  console.log("Cycle created:", data);
  // Perform necessary actions based on the event data
}

function handleCycleSucceededEvent(data: WebhookPayload["data"]) {
  // Handle recurring.cycle.succeeded event
  console.log("Cycle succeeded:", data);
  // Perform necessary actions based on the event data
}

function handleCycleRetryingEvent(data: WebhookPayload["data"]) {
  // Handle recurring.cycle.retrying event
  console.log("Cycle retrying:", data);
  // Perform necessary actions based on the event data
}

function handleCycleFailedEvent(data: WebhookPayload["data"]) {
  // Handle recurring.cycle.failed event
  console.log("Cycle failed:", data);
  // Perform necessary actions based on the event data
}
