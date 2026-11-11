import { randomBytes, scrypt } from "node:crypto";
import { connectToMongoDB } from "@/lib/mongodb";
import { registrationSchema } from "@/lib/validation/student";
import { Student } from "@/model/student";

function hashPassword(password: string, salt: Buffer) {
  return new Promise<Buffer>((resolve, reject) => {
    scrypt(password, salt, 64, (error, derivedKey) => {
      if (error) {
        reject(error);
      } else {
        resolve(derivedKey);
      }
    });
  });
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  const validation = registrationSchema.safeParse(body);
  if (!validation.success) {
    return Response.json(
      { error: validation.error.issues[0]?.message ?? "Please provide valid registration details." },
      { status: 400 },
    );
  }

  try {
    const { name, email, gender, age, password } = validation.data;
    const salt = randomBytes(16);
    const passwordHash = await hashPassword(password, salt);
    await connectToMongoDB();
    const result = await Student.create({
      name,
      gender,
      age,
      email,
      passwordSalt: salt.toString("hex"),
      passwordHash: passwordHash.toString("hex"),
    });

    return Response.json({ id: result._id.toString() }, { status: 201 });
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === 11000
    ) {
      return Response.json(
        { error: "An account with this email already exists." },
        { status: 409 },
      );
    }

    console.error("Failed to save registration:", error);
    return Response.json(
      { error: "Unable to save registration. Please try again later." },
      { status: 500 },
    );
  }
}
