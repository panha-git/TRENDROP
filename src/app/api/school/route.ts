
import { connectToMongoDB } from "@/lib/mongodb";

export async function GET() {
  await connectToMongoDB();
  return Response.json({
    message: "Hello, Next.js!"
  });
}


export async function POST() {
  const db = await connectToMongoDB();
  const form = {name : "Sample Student", age: "20", gender: "Male", email: "student@example.com"};
  const result = await db?.collection("school").insertOne(form);
  return Response.json({
    message: "Hello Boyyy",
    result: result?.insertedId
  });
}