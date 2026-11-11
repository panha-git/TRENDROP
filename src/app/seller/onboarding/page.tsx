import SellerOnboardingClient from "./onboarding-client";
import { requireCurrentUser } from "@/lib/require-auth";

export default async function SellerOnboardingPage() {
  const user = await requireCurrentUser("/seller/onboarding");
  return <SellerOnboardingClient role={user.role} sellerStatus={user.sellerStatus} />;
}
