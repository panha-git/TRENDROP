import SellerDashboardClient from "./dashboard-client";
import { requireApprovedSeller } from "@/lib/require-auth";

export default async function SellerDashboardPage() {
  await requireApprovedSeller("/seller/dashboard");
  return <SellerDashboardClient />;
}
