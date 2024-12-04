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
  businessName: z
    .string()
    .min(1, { message: "Business name is required" })
    .optional(),
  document: z.string(),
});

export const signInSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
});

export const resetPasswordSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  pin: z
    .string()
    .min(6, "PIN must be at least 6 characters long")
    .max(6, "PIN must be at most 6 characters long"),
  // .regex(/^[0-9a-fA-F]+$/, "PIN must be a hexadecimal string"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(
      /^(?=.*[0-9])(?=.*[!@#$%^&*.])/,
      "Password must contain at least one number and one special character",
    ),
  confirmPassword: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(
      /^(?=.*[0-9])(?=.*[!@#$%^&*.])/,
      "Password must contain at least one number and one special character",
    ),
});
