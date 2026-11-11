import { z } from "zod";

export const studentSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be at most 100 characters"),
  age: z.number().int().min(1, "Age must be at least 1").max(120, "Age must be at most 120"),
  gender: z.enum(["Female", "Male", "Non-binary", "Prefer not to say"]),
  email: z.string().email("Invalid email address"),
});

export const registrationSchema = studentSchema.extend({
  password: z.string().min(8, "Password must be at least 8 characters").max(128, "Password must be at most 128 characters"),
});

export type Student = z.infer<typeof studentSchema>;
