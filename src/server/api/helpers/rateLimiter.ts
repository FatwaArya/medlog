import { Ratelimit } from "@upstash/ratelimit"; // for deno: see above
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

const ratelimit = {
  FreePatient: new Ratelimit({
    redis,
    analytics: true,
    prefix: "ratelimit:BPatient",
    limiter: Ratelimit.slidingWindow(10, "1 d"),
  }),
  FreeCheckup: new Ratelimit({
    redis,
    analytics: true,
    prefix: "ratelimit:BCheckup",
    limiter: Ratelimit.slidingWindow(25, "1 d"),
  }),
  PersonalPatient: new Ratelimit({
    redis,
    analytics: true,
    prefix: "ratelimit:PPatient",
    limiter: Ratelimit.slidingWindow(35, "1 d"),
  }),
  PersonalCheckup: new Ratelimit({
    redis,
    analytics: true,
    prefix: "ratelimit:PCheckup",
    limiter: Ratelimit.slidingWindow(100, "1 d"),
  }),
};

export default ratelimit;
