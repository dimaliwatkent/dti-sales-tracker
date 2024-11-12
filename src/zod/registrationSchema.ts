import { z } from "zod";

export const registrationSchema = z.object({
  userId: z.string(),
  _id: z.string().optional(),
  name: z.string().min(1, { message: "Business name is required" }),
  address: z.string().min(1, { message: "Business address is required" }),
  logo: z.string().min(1, { message: "Business logo is required" }),
  facebookPage: z.string().optional(),
  ecommerceSite: z.string().optional(),
  website: z.string().optional(),
  paymentOption: z.string().refine(
    (value) => {
      return ["cash", "gcash", "maya"].includes(value);
    },
    { message: "Invalid payment option" },
  ),
  logisticServiceProvider: z.string().optional(),
  industryClassification: z.string().refine(
    (value) => {
      return [
        "manufacturing",
        "service",
        "retail",
        "wholesale",
        "construction",
      ].includes(value);
    },
    { message: "Invalid Industry Classification" },
  ),
  productLineService: z
    .string()
    .min(1, { message: "Product line/service is required" }),
  product: z.string().min(1, { message: "Products  is required" }),
  brandName: z.string().min(1, { message: "Brand name is required" }),
  category: z.string().refine(
    (value) => {
      return ["food", "non-food", "service"].includes(value);
    },
    { message: "Invalid category" },
  ),
  sole: z.string().refine(
    (value) => {
      return ["sole proprietorship", "partnership", "corporation"].includes(
        value,
      );
    },
    { message: "Invalid sole proprietorship" },
  ),
  assetSize: z.coerce
    .number()
    .gt(0, { message: "Asset size must be greater than zero" }),

  targetSale: z.coerce
    .number()
    .gt(0, { message: "Asset size must be greater than zero" }),
  fulltimeEmployee: z.coerce
    .number()
    .gt(0, { message: "Full-time employees must be greater than zero" }),
  parttimeEmployee: z.coerce
    .number()
    .min(0, { message: "Part-time employees must be a non-negative number" }),
  annualIncome: z.coerce
    .number()
    .gt(0, { message: "Annual income must be greater than zero" }),
  dateOfEstablishment: z.string(),
});
