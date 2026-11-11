import { ObjectId } from "mongodb";
import { connectToMongoDB } from "@/lib/mongodb";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const db = await connectToMongoDB();

  if (!ObjectId.isValid(id)) {
    return Response.json({ error: "Invalid school id." }, { status: 400 });
  }

  const school = await db?.collection("school").findOne({ _id: new ObjectId(id) });

  return Response.json({
    message: "School record fetched",
    id,
    school,
  });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const db = await connectToMongoDB();

  if (!ObjectId.isValid(id)) {
    return Response.json({ error: "Invalid school id." }, { status: 400 });
  }

  const result = await db?.collection("school").deleteOne({ _id: new ObjectId(id) });

  return Response.json({
    message: "School record deleted",
    id,
    deletedCount: result?.deletedCount ?? 0,
  });
}
