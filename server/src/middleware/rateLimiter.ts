import type { NextFunction, Request, Response } from 'express';

interface RateLimitBucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, RateLimitBucket>();

interface RateLimitOptions {
  windowMs?: number;
  max?: number;
  keyGenerator?: (req: Request) => string;
  message?: string;
}

export const rateLimit = ({
  windowMs = 60_000,
  max = 120,
  keyGenerator,
  message = 'Too many requests. Please retry shortly.',
}: RateLimitOptions = {}) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const key = keyGenerator?.(req) || `${req.ip}:${req.originalUrl.split('?')[0]}`;
    const now = Date.now();
    const bucket = buckets.get(key);

    if (!bucket || bucket.resetAt <= now) {
      buckets.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    bucket.count += 1;

    if (bucket.count > max) {
      const retryAfter = Math.max(1, Math.ceil((bucket.resetAt - now) / 1000));
      res.set('Retry-After', String(retryAfter));

      return res.status(429).json({
        ok: false,
        error: { code: 'RATE_LIMITED', message },
      });
    }

    next();
  };
};