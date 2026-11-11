import { createHash } from "node:crypto";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { connectToMongoDB } from "@/lib/mongodb";
import { orderLookupSchema } from "@/lib/validation/order";

export const runtime = "nodejs";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON." },
      { status: 400 },
    );
  }

  const validation = orderLookupSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  const accessTokenHash = createHash("sha256")
    .update(validation.data.accessToken)
    .digest("hex");

  try {
    const db = await connectToMongoDB();
    const order = await db.collection("orders").findOne(
      { _id: new ObjectId(id), accessTokenHash },
      { projection: { accessTokenHash: 0 } },
    );

    if (!order) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    const { _id, createdAt, updatedAt, ...orderDetails } = order;
    return NextResponse.json({
      order: {
        ...orderDetails,
        id: _id.toString(),
        createdAt:
          createdAt instanceof Date ? createdAt.toISOString() : createdAt,
        updatedAt:
          updatedAt instanceof Date ? updatedAt.toISOString() : updatedAt,
      },
    });
  } catch (error) {
    console.error("Failed to load marketplace order:", error);
    return NextResponse.json(
      { error: "Unable to load this order right now. Please try again." },
      { status: 503 },
    );
  }
}
