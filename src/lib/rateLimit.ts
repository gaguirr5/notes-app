import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetInSeconds: number;
}

let limiter: Ratelimit | null = null;

function getLimiter(): Ratelimit {
  if (!limiter) {
    const redis = Redis.fromEnv();
    limiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, "15 m"), // 5 attempts per 15 minutes
    });
  }
  return limiter;
}

export async function checkRateLimit(key: string): Promise<RateLimitResult> {
  const { success, remaining, reset } = await getLimiter().limit(key);
  return {
    success,
    remaining,
    resetInSeconds: Math.max(0, Math.round((reset - Date.now()) / 1000)),
  };
}
