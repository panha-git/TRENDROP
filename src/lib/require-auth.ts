import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/current-user";

export async function requireCurrentUser(path: string) {
  const user = await getCurrentUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(path)}`);
  return user;
}

export async function requireApprovedSeller(path: string) {
  const user = await requireCurrentUser(path);
  if (user.role !== "seller" || user.sellerStatus !== "approved") {
    redirect("/seller/onboarding");
  }
  return user;
}
