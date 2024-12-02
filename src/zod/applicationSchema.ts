import { z } from "zod";

export const applicationSchema = z.object({
  eventId: z.string(),
  userId: z.string(),
  _id: z.string().optional(),
  name: z.string().min(1, { message: "Business name is required" }),
  address: z
    .string({
      required_error: "Business address is required",
      invalid_type_error: "Business address must be a string",
    })
    .min(10, "Business address must be at least 10 characters")
    .max(200, "Business address cannot exceed 200 characters"),
  region: z
    .string({
      required_error: "Region is required",
      invalid_type_error: "Region must be a string",
    })
    .min(10, "Region must be at least 10 characters")
    .max(200, "Region cannot exceed 200 characters"),
  zip: z
    .string({
      required_error: "Zip code is required",
      invalid_type_error: "Zip code must be a string",
    })
    .regex(/^\d{4}$/, "Invalid zip code format")
    .min(4, "Zip code must be exactly 4 characters")
    .max(4, "Zip code must be exactly 4 characters"),
  logo: z.string().optional(),
  facebookPage: z.string().optional(),
  ecommerceSite: z.string().optional(),
  website: z.string().optional(),
  contactPersonName: z
    .string({
      required_error: "Name is required",
      invalid_type_error: "Name must be a string",
    })
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name cannot exceed 50 characters"),

  contactPersonNumber: z
    .string()
    .min(9, { message: "Phone number must be at least 9 digits" })
    .max(11, { message: "Phone number must not exceed 11 digits" })
    .regex(/^\d{10}$/, { message: "Invalid phone number format" }),

  contactPersonDesignation: z
    .string({
      required_error: "Designation is required",
      invalid_type_error: "Designation must be a string",
    })
    .min(3, "Designation must be at least 3 characters")
    .max(50, "Designation cannot exceed 50 characters"),
  contactPersonSex: z
    .string()
    .min(1, { message: "At least one sex option is required" }),
  paymentOption: z
    .array(z.string())
    .min(1, { message: "At least one payment option is required" }),
  logisticServiceProvider: z
    .array(z.string())
    .min(1, { message: "At least one  logistic service provider is required" }),
  industryClassification: z
    .array(z.string())
    .min(1, { message: "At least one industry classification is required" }),
  productLineService: z
    .array(z.string())
    .min(1, { message: "At least one product line or service is required" }),
  product: z.string().min(1, { message: "Products  is required" }),
  brandName: z.string().min(1, { message: "Brand name is required" }),
  category: z
    .array(z.string())
    .min(1, { message: "At least one category is required" }),
  type: z.string().min(1, { message: "At least one type option is required" }),
  assetSize: z
    .string()
    .min(1, { message: "At least one asset size option is required" }),
  targetSale: z.coerce
    .number()
    .gt(0, { message: "Target Sale must be greater than zero" }),
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
  logoFile: z.string(),

  waiverFile: z.string(),
  signedTermsFile: z.string(),
  paymentQRFile: z.string(),
  businessNameRegFile: z.string(),
  validIdFile: z.string(),
  menuCopyFile: z.string(),
  productPhotosFile: z.string(),
});

export const editApplicationSchema = applicationSchema
  .omit({
    eventId: true,
    userId: true,
  })
  .extend({
    event: z.string(),
    user: z.string(),
    applicationStatus: z.string(),
  });
