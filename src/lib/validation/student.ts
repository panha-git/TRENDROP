import { z } from "zod";

export const studentSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be at most 100 characters"),
  age: z.number().int().positive("Age must be a positive integer").min(1, "Age must be at least 1").max(120, "Age must be at most 120"),
  gender: z.enum(["male", "female", "other"], "Gender must be one of 'male', 'female', or 'other'"),
  email: z.string().email("Invalid email address"),
  enrolled: z.boolean(),

});

export type Student = z.infer<typeof studentSchema>;
