import { cookies } from "next/headers";
import { connectToMongoDB } from "@/lib/mongodb";
import { hashSessionToken, SESSION_COOKIE, verifySessionToken } from "@/lib/auth";
import { Session } from "@/model/session";
import { User } from "@/model/user";

export async function getCurrentUser() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const payload = verifySessionToken(token);
  if (!payload) return null;

  await connectToMongoDB();
  const session = await Session.findOne({
    tokenHash: hashSessionToken(token),
    userId: payload.userId,
    expiresAt: { $gt: new Date() },
  }).select("_id").lean();
  if (!session) return null;

  const user = await User.findById(payload.userId)
    .select("name email role sellerStatus")
    .lean();
  if (!user) return null;

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    sellerStatus: user.sellerStatus,
  };
}
