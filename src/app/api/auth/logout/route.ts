import { cookies } from "next/headers";
import {
  clearSessionCookie,
  hashSessionToken,
  isSameOriginRequest,
  SESSION_COOKIE,
} from "@/lib/auth";
import { connectToMongoDB } from "@/lib/mongodb";
import { Session } from "@/model/session";

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return Response.json({ error: "This request could not be verified." }, { status: 403 });
  }

  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  try {
    if (token) {
      await connectToMongoDB();
      await Session.deleteOne({ tokenHash: hashSessionToken(token) });
    }
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": clearSessionCookie(),
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Marketplace logout failed:", error);
    return Response.json(
      { error: "We couldn't sign you out. Please try again." },
      { status: 500 },
    );
  }
}
