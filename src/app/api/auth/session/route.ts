import { cookies } from "next/headers";
import { connectToMongoDB } from "@/lib/mongodb";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";
import { User } from "@/model/user";

export async function GET() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return Response.json({ user: null }, { headers: { "Cache-Control": "no-store" } });

  const session = verifySessionToken(token);
  if (!session) return Response.json({ user: null }, { headers: { "Cache-Control": "no-store" } });

  try {
    await connectToMongoDB();
    const user = await User.findById(session.userId).select("name email role sellerStatus").lean();
    if (!user) return Response.json({ user: null }, { headers: { "Cache-Control": "no-store" } });
    return Response.json({
      user: { id: user._id.toString(), name: user.name, email: user.email, role: user.role, sellerStatus: user.sellerStatus },
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Session lookup failed:", error);
    return Response.json({ error: "Unable to verify your session." }, { status: 500 });
  }
}
