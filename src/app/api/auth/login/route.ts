import { connectToMongoDB } from "@/lib/mongodb";
import { createSessionToken, sessionCookie, verifyPassword } from "@/lib/auth";
import { loginSchema } from "@/lib/validation/auth";
import { User } from "@/model/user";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Please enter your email and password." }, { status: 400 });
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0]?.message ?? "Check your login details." }, { status: 400 });
  }

  try {
    await connectToMongoDB();
    const user = await User.findOne({ email: parsed.data.email }).select("+passwordHash");
    if (!user || !(await verifyPassword(parsed.data.password, user.passwordHash))) {
      return Response.json({ error: "Email or password is incorrect." }, { status: 401 });
    }

    const token = createSessionToken(user._id.toString());
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
