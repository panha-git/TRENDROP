import { getCurrentUser } from "@/lib/current-user";
import { hashRateLimitKey, isSameOriginRequest } from "@/lib/auth";
import { consumeAuthRateLimit } from "@/lib/auth-rate-limit";
import { connectToMongoDB } from "@/lib/mongodb";
import { User } from "@/model/user";

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return Response.json({ error: "This request could not be verified." }, { status: 403 });
  }

  try {
    const user = await getCurrentUser();
    if (!user) {
      return Response.json({ error: "Please sign in to apply." }, { status: 401 });
    }
    if (user.role !== "buyer") {
      return Response.json({ error: "Only buyer accounts can submit a seller application." }, { status: 403 });
    }
    if (user.sellerStatus === "pending") {
      return Response.json({ error: "Your seller application is already pending." }, { status: 409 });
    }
    if (user.sellerStatus !== "not_applied" && user.sellerStatus !== "rejected") {
      return Response.json({ error: "Your account cannot submit a seller application." }, { status: 409 });
    }

    const limit = await consumeAuthRateLimit(
      hashRateLimitKey(`seller-application:user:${user.id}`),
      3,
      60 * 60,
    );
    if (!limit.allowed) {
      return Response.json(
        { error: "Too many application attempts. Please try again later." },
        { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
      );
    }

    await connectToMongoDB();
    const updatedUser = await User.findOneAndUpdate(
      {
        _id: user.id,
        role: "buyer",
        sellerStatus: { $in: ["not_applied", "rejected"] },
      },
      { $set: { sellerStatus: "pending" } },
      { new: true, runValidators: true },
    ).select("sellerStatus").lean();

    if (!updatedUser) {
      return Response.json({ error: "Your application status changed. Refresh and try again." }, { status: 409 });
    }

    return Response.json(
      { sellerStatus: updatedUser.sellerStatus },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Seller application submission failed:", error);
    return Response.json(
      { error: "We couldn't submit your application. Please try again." },
      { status: 500 },
    );
  }
}
