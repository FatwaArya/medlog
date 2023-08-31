import { type NextApiRequest, type NextApiResponse } from "next";
import {
  type RecurringPlanPayload,
  type RecurringCyclePayload,
} from "@/server/api/interface/recurring";
import { clerkClient } from "@clerk/nextjs";

import { prisma } from "@/server/db";
import {
  type IRecurringPlan,
  type Schedule,
} from "@/server/api/interface/recurring/plan";
import { type IRecurringCycle } from "@/server/api/interface/recurring/cycle";
import { env } from "@/env.mjs";
import { log } from "next-axiom";

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
    log.info("Webhook verified", payload);
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

    log.info("Webhook processing successful");
    // Send a success response
    res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    log.error("Webhook processing failed or invalid xendit signature", error);
    res
      .status(500)
      .json({ error: "Webhook processing failed or invalid xendit signature" });
  }
}

// Handler functions for each webhook event type
async function handlePlanActivatedEvent(data: IRecurringPlan) {
  await prisma.$transaction(async (tx) => {
    const updateUserMetadata = await clerkClient.users.updateUserMetadata(
      data.reference_id,
      {
        publicMetadata: {
          isSubscribed: true,
          plan: data.metadata.plan as "beginner" | "personal" | "professional",
        },
      },
    );
    log.info("update user metadata on activated plan", { updateUserMetadata });

    const subscribedUntil = calculateSubscribedUntil(data.schedule);
    log.info("subscribedUntil", { subscribedUntil });

    const updateSubscription = await tx.subscription.create({
      data: {
        id: data.id,
        status: "active",
        userId: data.reference_id,
        subscribedUntil: subscribedUntil,
      },
    });
    log.info("update subscription activated plan", { updateSubscription });
  });
}
async function handlePlanInactivatedEvent(data: IRecurringPlan) {
  // Handle recurring.plan.inactivated event
  // Perform necessary actions based on the event data
  await prisma.$transaction(async (tx) => {
    const updateUserMetadata = await clerkClient.users.updateUserMetadata(
      data.reference_id,
      {
        publicMetadata: {
          isSubscribed: false,
          plan: "noSubscription",
        },
      },
    );
    log.info("update user metadata on inactivated plan", {
      updateUserMetadata,
    });

    const updateSubscription = await tx.subscription.updateMany({
      where: {
        id: data.id,
      },
      data: {
        status: "inactive",
        subscribedUntil: null,
      },
    });

    log.info("update subscription inactivated plan", { updateSubscription });
  });
}

async function handleCycleSucceededEvent(data: IRecurringCycle) {
  // Handle recurring.cycle.succeeded event
  await prisma.$transaction(async (tx) => {
    const updateSubscription = await tx.subscription.update({
      where: {
        id: data.plan_id,
      },
      data: {
        status: "active",
        subscribedUntil: data.scheduled_timestamp,
      },
    });

    log.info("update subscription succeeded cycle", { updateSubscription });
  });
}

async function handleCycleCreatedEvent(data: IRecurringCycle) {
  console.log("Cycle created 1");

  await prisma.$transaction(async (tx) => {
    const updateSubscription = await tx.subscription.update({
      where: {
        id: data.plan_id,
      },
      data: {
        status: "active",
        subscribedUntil: data.scheduled_timestamp,
      },
    });

    log.info("update subscription created cycle", { updateSubscription });
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
