import { connectToMongoDB } from "@/lib/mongodb";
import {
  createSessionToken,
  hashRateLimitKey,
  hashSessionToken,
  isSameOriginRequest,
  SESSION_SECONDS,
  sessionCookie,
  verifyPassword,
} from "@/lib/auth";
import { consumeAuthRateLimit, getClientAddress } from "@/lib/auth-rate-limit";
import { readJsonBody, RequestBodyTooLargeError } from "@/lib/http";
import { loginSchema } from "@/lib/validation/auth";
import { Session } from "@/model/session";
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
      return Response.json({ error: "Sign-in details are too large." }, { status: 413 });
    }
    return Response.json({ error: "Please enter your email and password." }, { status: 400 });
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0]?.message ?? "Check your login details." }, { status: 400 });
  }

  try {
    const ipLimit = await consumeAuthRateLimit(
      hashRateLimitKey(`login:ip:${getClientAddress(request)}`),
      20,
      15 * 60,
    );
    if (!ipLimit.allowed) {
      return Response.json(
        { error: "Too many sign-in attempts. Please try again later." },
        { status: 429, headers: { "Retry-After": String(ipLimit.retryAfter) } },
      );
    }

    const emailLimit = await consumeAuthRateLimit(
      hashRateLimitKey(`login:email:${parsed.data.email}`),
      10,
      15 * 60,
    );
    if (!emailLimit.allowed) {
      return Response.json(
        { error: "Too many sign-in attempts. Please try again later." },
        { status: 429, headers: { "Retry-After": String(emailLimit.retryAfter) } },
      );
    }

    await connectToMongoDB();
    const user = await User.findOne({ email: parsed.data.email }).select("+passwordHash");
    if (!user || !(await verifyPassword(parsed.data.password, user.passwordHash))) {
      return Response.json({ error: "Email or password is incorrect." }, { status: 401 });
    }

    const token = createSessionToken(user._id.toString());
    await Session.create({
      userId: user._id,
      tokenHash: hashSessionToken(token),
      expiresAt: new Date(Date.now() + SESSION_SECONDS * 1000),
    });
    return new Response(JSON.stringify({
      user: { id: user._id.toString(), name: user.name, email: user.email, role: user.role },
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": sessionCookie(token),
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Marketplace login failed:", error);
    return Response.json({ error: "We couldn't sign you in. Please try again." }, { status: 500 });
  }
}
