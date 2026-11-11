import { randomBytes, scrypt } from "node:crypto";
import type { Document } from "mongodb";
import { connectToMongoDB } from "@/lib/mongodb";
import { Student } from "@/model/student";

interface RegistrationDocument extends Document {
  name: string;
  gender: string;
  age: number;
  email: string;
  passwordSalt: string;
  passwordHash: string;
  createdAt: Date;
}

const genders = ["Female", "Male", "Non-binary", "Prefer not to say"];

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

export async function GET() {
  try {
    const db = await connectToMongoDB();
    const registrations = await Student.find().sort({ createdAt: -1 });

    return Response.json({
      users: registrations.map((item) => item),
    });
  } catch (error) {
    console.error("Failed to load registrations:", error);
    return Response.json(
      { error: "Unable to load registrations from the database." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return Response.json({ error: "Registration details are required." }, { status: 400 });
  }

  const data = body as Record<string, unknown>;
  const name = typeof data.name === "string" ? data.name.trim() : "";
  const email = typeof data.email === "string" ? data.email.trim().toLowerCase() : "";
  const gender = typeof data.gender === "string" ? data.gender : "";
  const age = data.age;
  const password = typeof data.password === "string" ? data.password : "";

  if (
    !name ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    !genders.includes(gender) ||
    typeof age !== "number" ||
    !Number.isInteger(age) ||
    age < 1 ||
    age > 120 ||
    password.length < 8
  ) {
    return Response.json(
      { error: "Please provide valid registration details." },
      { status: 400 },
    );
  }

  try {
    const salt = randomBytes(16);
    const passwordHash = await hashPassword(password, salt);
    const db = await connectToMongoDB();
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
    console.error("Failed to save registration:", error);
    const message =
      error instanceof Error ? error.message : "Unknown server error.";
    return Response.json({ error: message }, { status: 500 });
  }
}
