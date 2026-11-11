import { getCurrentUser } from "@/lib/current-user";

export async function GET() {
  try {
    return Response.json(
      { user: await getCurrentUser() },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Session lookup failed:", error);
    return Response.json({ error: "Unable to verify your session." }, { status: 500 });
  }
}
