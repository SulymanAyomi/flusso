// lib/rate-limit.ts

/**
 * Simple in-memory rate limiter
 * For production, use Vercel KV or Redis
 */

interface RateLimitEntry {
    count: number;
    resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup old entries every 5 minutes
setInterval(() => {
    const now = Date.now();
    for (const [key, value] of rateLimitStore.entries()) {
        if (now > value.resetAt) {
            rateLimitStore.delete(key);
        }
    }
}, 5 * 60 * 1000);

export interface RateLimitResult {
    allowed: boolean;
    limit: number;
    remaining: number;
    resetAt: number;
    retryAfter?: number;
}

/**
 * Check rate limit for an identifier
 * @param identifier - Usually IP address
 * @param maxRequests - Max requests per window (default: 10)
 * @param windowMs - Time window in milliseconds (default: 1 minute)
 */
export function checkRateLimit(
    identifier: string,
    maxRequests: number = 10,
    windowMs: number = 60000
): RateLimitResult {
    const now = Date.now();
    const entry = rateLimitStore.get(identifier);

    // No previous entry - create new one
    if (!entry) {
        rateLimitStore.set(identifier, {
            count: 1,
            resetAt: now + windowMs
        });

        return {
            allowed: true,
            limit: maxRequests,
            remaining: maxRequests - 1,
            resetAt: now + windowMs
        };
    }

    // Entry exists but expired - reset
    if (now > entry.resetAt) {
        rateLimitStore.set(identifier, {
            count: 1,
            resetAt: now + windowMs
        });

        return {
            allowed: true,
            limit: maxRequests,
            remaining: maxRequests - 1,
            resetAt: now + windowMs
        };
    }

    // Entry exists and valid - check limit
    if (entry.count >= maxRequests) {
        return {
            allowed: false,
            limit: maxRequests,
            remaining: 0,
            resetAt: entry.resetAt,
            retryAfter: Math.ceil((entry.resetAt - now) / 1000) // seconds
        };
    }

    // Increment count
    entry.count++;
    rateLimitStore.set(identifier, entry);

    return {
        allowed: true,
        limit: maxRequests,
        remaining: maxRequests - entry.count,
        resetAt: entry.resetAt
    };
}