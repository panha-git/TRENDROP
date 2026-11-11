import { connectToMongoDB } from "@/lib/mongodb";

type RateLimitResult = { allowed: boolean; retryAfter: number };

const globalForRateLimit = globalThis as typeof globalThis & {
  authRateLimitIndexPromise?: Promise<string>;
};

export async function consumeAuthRateLimit(
  key: string,
  limit: number,
  windowSeconds: number,
): Promise<RateLimitResult> {
  const db = await connectToMongoDB();
  const collection = db.collection<{ _id: string; count: number; expiresAt: Date }>("auth_rate_limits");
  globalForRateLimit.authRateLimitIndexPromise ??= collection.createIndex(
    { expiresAt: 1 },
    { expireAfterSeconds: 0 },
  );
  try {
    await globalForRateLimit.authRateLimitIndexPromise;
  } catch (error) {
    globalForRateLimit.authRateLimitIndexPromise = undefined;
    throw error;
  }

  const now = new Date();
  const resetAt = new Date(now.getTime() + windowSeconds * 1000);
  await collection.updateOne(
    { _id: key },
    [
      {
        $set: {
          count: {
            $cond: [
              { $gt: ["$expiresAt", now] },
              { $add: [{ $ifNull: ["$count", 0] }, 1] },
              1,
            ],
          },
          expiresAt: {
            $cond: [{ $gt: ["$expiresAt", now] }, "$expiresAt", resetAt],
          },
        },
      },
    ],
    { upsert: true },
  );

  const record = await collection.findOne({ _id: key });
  if (!record) throw new Error("The authentication rate limit could not be recorded.");
  return {
    allowed: record.count <= limit,
    retryAfter: Math.max(1, Math.ceil((record.expiresAt.getTime() - now.getTime()) / 1000)),
  };
}

export function getClientAddress(request: Request) {
  const address = request.headers.get("x-real-ip") ?? request.headers.get("x-forwarded-for");
  return address?.split(",")[0]?.trim() || "unknown";
}
