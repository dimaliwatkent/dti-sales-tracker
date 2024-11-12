import { z } from "zod";

export const signUpSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  name: z.string().min(3, { message: "Name is required" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
  confirmPassword: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
  phoneNumber: z
    .string()
    .min(9, { message: "Phone number must be at least 9 digits" })
    .max(11, { message: "Phone number must not exceed 11 digits" })
    .regex(/^\d{10}$/, { message: "Invalid phone number format" }),
  role: z.string(),
});

export const signInSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});
