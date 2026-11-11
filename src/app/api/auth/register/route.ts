import { connectToMongoDB } from "@/lib/mongodb";
import { hashPassword } from "@/lib/auth";
import { registerSchema } from "@/lib/validation/auth";
import { User } from "@/model/user";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Please submit valid registration details." }, { status: 400 });
  }

  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0]?.message ?? "Check your details." }, { status: 400 });
  }

  try {
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
    }, { status: 201 });
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === 11000) {
      return Response.json({ error: "An account with this email already exists. Please sign in." }, { status: 409 });
    }
    console.error("Marketplace registration failed:", error);
    return Response.json({ error: "We couldn't create your account. Please try again." }, { status: 500 });
  }
}
