const buckets = new Map();

export const rateLimit = ({ windowMs = 60_000, max = 120 } = {}) => {
  return (req, res, next) => {
    const key = `${req.ip}:${req.originalUrl.split('?')[0]}`;
    const now = Date.now();
    const bucket = buckets.get(key);

    if (!bucket || bucket.resetAt <= now) {
      buckets.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    bucket.count += 1;

    if (bucket.count > max) {
      return res.status(429).json({
        ok: false,
        error: { code: 'RATE_LIMITED', message: 'Too many requests. Please retry shortly.' },
      });
    }

    next();
  };
};
