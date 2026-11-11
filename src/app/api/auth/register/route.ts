import { connectToMongoDB } from "@/lib/mongodb";
import { hashPassword, hashRateLimitKey, isSameOriginRequest } from "@/lib/auth";
import { consumeAuthRateLimit, getClientAddress } from "@/lib/auth-rate-limit";
import { readJsonBody, RequestBodyTooLargeError } from "@/lib/http";
import { registerSchema } from "@/lib/validation/auth";
import { User } from "@/model/user";

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return Response.json({ error: "This request could not be verified." }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await readJsonBody(request);
  } catch (error) {
    if (error instanceof RequestBodyTooLargeError) {
      return Response.json({ error: "Registration details are too large." }, { status: 413 });
    }
    return Response.json({ error: "Please submit valid registration details." }, { status: 400 });
  }

  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0]?.message ?? "Check your details." }, { status: 400 });
  }

  try {
    const ipLimit = await consumeAuthRateLimit(
      hashRateLimitKey(`register:ip:${getClientAddress(request)}`),
      10,
      60 * 60,
    );
    if (!ipLimit.allowed) {
      return Response.json(
        { error: "Too many registration attempts. Please try again later." },
        { status: 429, headers: { "Retry-After": String(ipLimit.retryAfter) } },
      );
    }

    const emailLimit = await consumeAuthRateLimit(
      hashRateLimitKey(`register:email:${parsed.data.email}`),
      3,
      60 * 60,
    );
    if (!emailLimit.allowed) {
      return Response.json(
        { error: "Too many registration attempts. Please try again later." },
        { status: 429, headers: { "Retry-After": String(emailLimit.retryAfter) } },
      );
    }

    await connectToMongoDB();
    const existing = await User.findOne({ email: parsed.data.email }).select("_id").lean();
    if (existing) {
      return Response.json({ error: "An account with this email already exists. Please sign in." }, { status: 409 });
    }

    const user = await User.create({
      name: parsed.data.name,
      email: parsed.data.email,
      passwordHash: await hashPassword(parsed.data.password),
      role: "buyer",
      sellerStatus: "not_applied",
    });

    return Response.json({
      user: { id: user._id.toString(), name: user.name, email: user.email, role: user.role },
    }, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === 11000) {
      return Response.json({ error: "An account with this email already exists. Please sign in." }, { status: 409 });
    }
    console.error("Marketplace registration failed:", error);
    return Response.json({ error: "We couldn't create your account. Please try again." }, { status: 500 });
  }
}
