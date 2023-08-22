import { clerkClient } from "@clerk/nextjs";
import { type NextApiRequest, type NextApiResponse } from "next";

const newUserHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const user = await clerkClient.users.updateUserMetadata(req.body.data.id, {
      publicMetadata: {
        isSubscribed: false,
        plan: "noSubscription",
      },
    });

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: "Webhook processing failed" });
  }
};

export default newUserHandler;
