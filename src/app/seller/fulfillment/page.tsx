import SellerFulfillmentClient from "./fulfillment-client";
import { requireApprovedSeller } from "@/lib/require-auth";

export default async function SellerFulfillmentPage() {
  await requireApprovedSeller("/seller/fulfillment");
  return <SellerFulfillmentClient />;
}
