import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(100, "Name is too long."),
  email: z.string().trim().email("Enter a valid email address.").max(254).transform((value) => value.toLowerCase()),
  password: z.string().min(8, "Password must be at least 8 characters.").max(128, "Password is too long."),
  confirmPassword: z.string().min(1, "Please confirm your password."),
}).strict().refine((value) => value.password === value.confirmPassword, {
  message: "Your passwords do not match.",
  path: ["confirmPassword"],
});

export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address.").max(254).transform((value) => value.toLowerCase()),
  password: z.string().min(1, "Enter your password.").max(128),
}).strict();
