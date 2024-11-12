import { z } from "zod";

export const applicationSchema = z.object({
  eventId: z.string(),
  userId: z.string(),
  _id: z.string().optional(),
  name: z.string().min(1, { message: "Business name is required" }),
  address: z.string().min(1, { message: "Business address is required" }),
  logo: z.string().optional(),
  facebookPage: z.string().optional(),
  ecommerceSite: z.string().optional(),
  website: z.string().optional(),
  paymentOption: z
    .array(z.string())
    .min(1, { message: "At least one payment option is required" }),
  logisticServiceProvider: z.string().optional(),
  industryClassification: z
    .array(z.string())
    .min(1, { message: "At least one payment option is required" }),
  productLineService: z
    .string()
    .min(1, { message: "Product line/service is required" }),
  product: z.string().min(1, { message: "Products  is required" }),
  brandName: z.string().min(1, { message: "Brand name is required" }),
  category: z
    .array(z.string())
    .min(1, { message: "At least one payment option is required" }),

  type: z.string().refine(
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
  dateOfEstablishment: z
    .string()
    .min(10, { message: "Date of establishment required" }),
});

export const editApplicationSchema = z.object({
  _id: z.string(),
  event: z.string(),
  user: z.string(),
  name: z.string().min(1, { message: "Business name is required" }),
  address: z.string().min(1, { message: "Business address is required" }),
  logo: z.string().optional(),
  facebookPage: z.string().optional(),
  ecommerceSite: z.string().optional(),
  website: z.string().optional(),
  paymentOption: z
    .array(z.string())
    .min(1, { message: "At least one payment option is required" }),
  logisticServiceProvider: z.string().optional(),
  industryClassification: z
    .array(z.string())
    .min(1, { message: "At least one payment option is required" }),
  productLineService: z
    .string()
    .min(1, { message: "Product line/service is required" }),
  product: z.string().min(1, { message: "Products  is required" }),
  brandName: z.string().min(1, { message: "Brand name is required" }),
  category: z
    .array(z.string())
    .min(1, { message: "At least one payment option is required" }),

  type: z.string().refine(
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
  dateOfEstablishment: z
    .string()
    .min(10, { message: "Date of establishment required" }),
  applicationStatus: z.string(),
});
