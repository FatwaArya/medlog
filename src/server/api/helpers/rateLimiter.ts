import { Ratelimit } from "@upstash/ratelimit"; // for deno: see above
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

const ratelimit = {
  BPatient: new Ratelimit({
    redis,
    analytics: true,
    prefix: "ratelimit:BPatient",
    limiter: Ratelimit.slidingWindow(10, "1 d"),
  }),
  BCheckup: new Ratelimit({
    redis,
    analytics: true,
    prefix: "ratelimit:BCheckup",
    limiter: Ratelimit.slidingWindow(25, "1 d"),
  }),
  PPatient: new Ratelimit({
    redis,
    analytics: true,
    prefix: "ratelimit:PPatient",
    limiter: Ratelimit.slidingWindow(35, "1 d"),
  }),
  PCheckup: new Ratelimit({
    redis,
    analytics: true,
    prefix: "ratelimit:PCheckup",
    limiter: Ratelimit.slidingWindow(100, "1 d"),
  }),
};

export default ratelimit;
