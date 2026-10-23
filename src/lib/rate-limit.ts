// Minimal in-memory, per-IP fixed-window rate limiter (no dependencies).
//
// NOTE: this state lives in a single Node.js process, so limits are
// per-instance and reset on restart. It blunts casual abuse/floods from one
// deployment instance, but production should ALSO enforce rate limiting at
// the edge (e.g. Vercel Firewall / Cloudflare) in front of these routes.

type Window = { count: number; resetAt: number };

const buckets = new Map<string, Window>();

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return request.headers.get('x-real-ip') ?? 'unknown';
}

export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): { ok: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now >= bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfterSeconds: 0 };
  }

  if (bucket.count >= limit) {
    return {
      ok: false,
      retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
    };
  }

  bucket.count += 1;
  return { ok: true, retryAfterSeconds: 0 };
}

// Opportunistic cleanup so the map cannot grow without bound.
export function pruneRateLimitBuckets(): void {
  if (buckets.size < 10_000) return;
  const now = Date.now();
  buckets.forEach((bucket, key) => {
    if (now >= bucket.resetAt) buckets.delete(key);
  });
}
