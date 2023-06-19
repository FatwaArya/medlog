import { type NextApiRequest, type NextApiResponse } from "next";
import { type WebhookPayload } from "@/server/api/interface/subscriptionEvent";
import { prisma } from "@/server/db";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const payload: WebhookPayload = req.body; // Assuming the webhook payload is sent in the request body
    console.log("Received webhook payload:", payload);
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
async function handlePlanActivatedEvent(data: WebhookPayload["data"]) {
  // Handle recurring.plan.activated event
  // Merchants can use this as an indication that the Subscriptions plan was successfully created and it will proceed for the defined schedule.
  // If this is not received, the plan would not proceed
  const anchorDate = new Date(data.schedule.anchor_date);
  const totalRecurrence = data.schedule.total_recurrence;

  const subscribedUntil = new Date(anchorDate.getTime());
  subscribedUntil.setMonth(anchorDate.getMonth() + totalRecurrence);
  try {
    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: {
          id: data.reference_id,
        },
        data: {
          isSubscribed: true,
        },
      });
      await tx.subscription.create({
        data: {
          id: data.id,
          status: "active",
          subscriberId: data.reference_id,
          subscribedUntil: subscribedUntil,
        },
      });
    });
  } catch (error) {
    console.error("Error handling webhook:", error);
    throw new Error("Webhook processing failed");
  }
}
async function handlePlanInactivatedEvent(data: WebhookPayload["data"]) {
  // Handle recurring.plan.inactivated event
  // Perform necessary actions based on the event data
  try {
    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: {
          id: data.reference_id,
        },
        data: {
          isSubscribed: false,
        },
      });
      await tx.subscription.updateMany({
        where: {
          id: data.reference_id,
        },
        data: {
          status: "inactive",
          subscribedUntil: null,
        },
      });
    });
  } catch (error) {
    console.error("Error handling webhook:", error);
    throw new Error("Webhook processing failed");
  }
}

async function handleCycleCreatedEvent(data: WebhookPayload["data"]) {
  const anchorDate = new Date(data.schedule.anchor_date);
  const totalRecurrence = data.schedule.total_recurrence;

  const subscribedUntil = new Date(anchorDate.getTime());
  subscribedUntil.setMonth(anchorDate.getMonth() + totalRecurrence);

  try {
    await prisma.$transaction(async (tx) => {
      await tx.subscription.update({
        where: {
          id: data.reference_id,
        },
        data: {
          status: "active",
          subscribedUntil: subscribedUntil,
        },
      });
    });
  } catch (error) {
    console.error("Error handling webhook:", error);
    throw new Error("Webhook processing failed");
  }
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
