import { type NextApiRequest, type NextApiResponse } from "next";
import {
  type RecurringPlanPayload,
  type RecurringCyclePayload,
} from "@/server/api/interface/recurring";

import { prisma } from "@/server/db";
import {
  type IRecurringPlan,
  type Schedule,
} from "@/server/api/interface/recurring/plan";
import { IRecurringCycle } from "@/server/api/interface/recurring/cycle";
import { env } from "@/env.mjs";

function calculateSubscribedUntil(schedule: Schedule): string {
  const anchorDate = new Date(schedule.anchor_date);
  const interval = schedule.interval;
  const intervalCount = schedule.interval_count;

  const subscribedUntil = new Date(anchorDate);
  switch (interval) {
    case "DAY":
      subscribedUntil.setDate(subscribedUntil.getDate() + intervalCount);
      break;
    case "WEEK":
      subscribedUntil.setDate(subscribedUntil.getDate() + intervalCount * 7);
      break;
    case "MONTH":
      subscribedUntil.setMonth(subscribedUntil.getMonth() + intervalCount);
      break;
    case "YEAR":
      subscribedUntil.setFullYear(
        subscribedUntil.getFullYear() + intervalCount,
      );
      break;
    default:
      // Handle unsupported interval types
      break;
  }

  const formattedSubscribedUntil = subscribedUntil.toISOString();
  return formattedSubscribedUntil;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    //check if the request is from Xendit
    const xenditSignature = req.headers["x-callback-token"];
    if (xenditSignature !== env.XENDIT_CALLBACK_TOKEN) {
      throw new Error("Invalid Xendit signature");
    }

    const payload = req.body as RecurringPlanPayload | RecurringCyclePayload; // Updated type

    console.log("Received webhook payload:", JSON.stringify(payload, null, 2));
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
        throw new Error(`Unsupported event type`);
    }

    // Send a success response
    res.status(200).json({ success: true });
  } catch (error) {
    // Handle any errors that occur during webhook processing
    console.log(error);
    res
      .status(500)
      .json({ error: "Webhook processing failed or invalid xendit signature" });
  }
}

// Handler functions for each webhook event type
async function handlePlanActivatedEvent(data: IRecurringPlan) {
  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: {
        id: data.reference_id,
      },
      data: {
        isSubscribed: true,
        plan: data.metadata.plan as "beginner" | "personal" | "professional",
      },
    });
    const subscribedUntil = calculateSubscribedUntil(data.schedule);

    await tx.subscription.create({
      data: {
        id: data.id,
        status: "active",
        userId: data.reference_id,
        subscribedUntil: subscribedUntil,
      },
    });
  });
}
async function handlePlanInactivatedEvent(data: IRecurringPlan) {
  // Handle recurring.plan.inactivated event
  // Perform necessary actions based on the event data
  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: {
        id: data.reference_id,
      },
      data: {
        isSubscribed: false,
        plan: "noSubscription",
      },
    });
    await tx.subscription.updateMany({
      where: {
        id: data.id,
      },
      data: {
        status: "inactive",
        subscribedUntil: null,
      },
    });
  });
}

function handleCycleSucceededEvent(data: IRecurringCycle) {
  // Handle recurring.cycle.succeeded event
  console.log("Cycle succeeded 3");
  // Perform necessary actions based on the event data
}

async function handleCycleCreatedEvent(data: IRecurringCycle) {
  console.log("Cycle created 1");

  await prisma.$transaction(async (tx) => {
    await tx.subscription.update({
      where: {
        id: data.plan_id,
      },
      data: {
        status: "active",
        subscribedUntil: data.scheduled_timestamp,
      },
    });
  });
}

function handleCycleRetryingEvent(data: IRecurringCycle) {
  // Handle recurring.cycle.retrying event
  console.log("Cycle retrying:", data);
  // Perform necessary actions based on the event data
}

function handleCycleFailedEvent(data: IRecurringCycle) {
  // Handle recurring.cycle.failed event
  console.log("Cycle failed:", data);
  // Perform necessary actions based on the event data
}
