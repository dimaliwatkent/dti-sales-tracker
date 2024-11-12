import { z } from "zod";

export const addProductSchema = z.object({
  userId: z.string(),
  name: z.string().min(3, { message: "Product name is required" }),
  price: z
    .string()
    .regex(/^\d+(\.\d+)?$/, { message: "Price must be a valid number" }),
});

export const editProductSchema = z.object({
  userId: z.string(),
  name: z.string().min(3, { message: "Product name is required" }),
  price: z
    .string()
    .regex(/^\d+(\.\d+)?$/, { message: "Price must be a valid number" }),
});
