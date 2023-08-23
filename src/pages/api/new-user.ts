import { instance } from "@/server/axios";
import { clerkClient } from "@clerk/nextjs";
import { type User } from "@clerk/nextjs/dist/types/server";
import { type NextApiRequest, type NextApiResponse } from "next";
import type { WebhookRequiredHeaders } from "svix";
import type { UserJSON, WebhookEvent } from "@clerk/nextjs/server";
import { Webhook } from "svix";
import type { IncomingHttpHeaders } from "http";
import { env } from "@/env.mjs";

const webhookSecret: string = env.CLERK_WEBHOOK_SECRET_NEWUSER;

type NextApiRequestWithSvixRequiredHeaders = NextApiRequest & {
  headers: IncomingHttpHeaders & WebhookRequiredHeaders;
};

function formatPhoneNumber(phoneNumber: string) {
  if (phoneNumber.startsWith("0")) {
    return "+62" + phoneNumber.slice(1);
  }
  return phoneNumber;
}

const newUserHandler = async (
  req: NextApiRequestWithSvixRequiredHeaders,
  res: NextApiResponse,
) => {
  const payload = JSON.stringify(req.body);
  const headers = req.headers;
  // Create a new Webhook instance with your webhook secret
  const wh = new Webhook(webhookSecret);

  let evt: WebhookEvent;
  try {
    // Verify the webhook payload and headers
    evt = wh.verify(payload, headers) as WebhookEvent;
  } catch (_) {
    // If the verification fails, return a 400 error
    return res.status(400).json({});
  }

  const {
    id: userId,
    email_addresses,
    first_name,
    last_name,
    phone_numbers,
  } = evt.data as UserJSON;
  console.log();

  try {
    const customer = await instance.post("/customers", {
      reference_id: userId,
      individual_detail: {
        given_names: first_name,
        surname: last_name,
      },
      email: email_addresses[0]?.email_address,
      type: "INDIVIDUAL",
      ...(phone_numbers[0]?.phone_number && {
        mobile_number: formatPhoneNumber(phone_numbers[0]?.phone_number),
      }),
    });

    console.log(customer.data);

    const user = await clerkClient.users.updateUserMetadata(req.body.data.id, {
      publicMetadata: {
        isSubscribed: false,
        plan: "noSubscription",
      },
      privateMetadata: {
        customer_id: customer.data.id,
      },
    });

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: "Webhook processing failed" });
  }
};

export default newUserHandler;
