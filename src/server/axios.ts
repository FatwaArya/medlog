import { env } from "@/env.mjs";
import axios, { type AxiosInstance } from "axios";

export const instance: AxiosInstance = axios.create({
  baseURL: "https://api.xendit.co",
  headers: {
    Authorization: `Basic ${Buffer.from(env.XENDIT_SERVER_KEY + ":").toString(
      "base64"
    )}`,
    "Content-Type": "application/json",
  },
});
