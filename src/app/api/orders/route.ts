import { createHash, randomBytes } from "node:crypto";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { getProductById } from "@/lib/catalog";
import { connectToMongoDB } from "@/lib/mongodb";
import { createOrderSchema } from "@/lib/validation/order";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON." },
      { status: 400 },
    );
  }

  const validation = createOrderSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(
      {
        error:
          validation.error.issues[0]?.message ??
          "Please provide valid order details.",
      },
      { status: 400 },
    );
  }

  const items = [];
  for (const requestedItem of validation.data.items) {
    const product = getProductById(requestedItem.productId);
    if (!product) {
      return NextResponse.json(
        { error: "A product in your cart is no longer available." },
        { status: 400 },
      );
    }
    if (
      requestedItem.variant &&
      !product.variants?.includes(requestedItem.variant)
    ) {
      return NextResponse.json(
        { error: `The selected option for ${product.name} is unavailable.` },
        { status: 400 },
      );
    }

    items.push({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      seller: product.seller,
      image: product.image,
      unitPriceCents: Math.round(product.price * 100),
      quantity: requestedItem.quantity,
      ...(requestedItem.variant ? { variant: requestedItem.variant } : {}),
    });
  }

  const subtotalCents = items.reduce(
    (total, item) => total + item.unitPriceCents * item.quantity,
    0,
  );
  const now = new Date();
  const id = new ObjectId();
  const orderNumber = `TR-${id.toHexString().slice(-8).toUpperCase()}`;
  const accessToken = randomBytes(32).toString("hex");
  const accessTokenHash = createHash("sha256")
    .update(accessToken)
    .digest("hex");

  const order = {
    _id: id,
    orderNumber,
    createdAt: now,
    updatedAt: now,
    status: "awaiting_payment" as const,
    paymentStatus: "not_connected" as const,
    currency: "USD" as const,
    subtotalCents,
    shippingAddress: validation.data.shippingAddress,
    items,
    accessTokenHash,
  };

  try {
    const db = await connectToMongoDB();
    await db.collection("orders").insertOne(order);
    return NextResponse.json(
      {
        order: {
          id: id.toHexString(),
          orderNumber,
          createdAt: now.toISOString(),
          status: order.status,
          paymentStatus: order.paymentStatus,
          currency: order.currency,
          subtotalCents,
          items,
        },
        accessToken,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Failed to save marketplace order:", error);
    return NextResponse.json(
      { error: "Unable to save your order right now. Please try again." },
      { status: 503 },
    );
  }
}
