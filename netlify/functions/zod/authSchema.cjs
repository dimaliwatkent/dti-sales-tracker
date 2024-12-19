const { z } = require("zod");

const signUpSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  name: z.string().min(3, { message: "Name is required" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&])[A-Za-z\d@#$!%*?&]{8,}$/,
      {
        message:
          "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character",
      },
    ),
  confirmPassword: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&])[A-Za-z\d@#$!%*?&]{8,}$/,
      {
        message:
          "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character",
      },
    ),
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
  dtiRegistrationNumber: z
    .string()
    .min(8, { message: "DTI Registration Number must be 8 digits" })
    .max(8, { message: "DTI Registration Number must be 8 digits" }),
});

const signInSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&])[A-Za-z\d@#$!%*?&]{8,}$/,
      {
        message:
          "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character",
      },
    ),
});

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
});

const resetPasswordSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  pin: z
    .string()
    .min(6, "PIN must be at least 6 characters long")
    .max(6, "PIN must be at most 6 characters long"),
  // .regex(/^[0-9a-fA-F]+$/, "PIN must be a hexadecimal string"),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&])[A-Za-z\d@#$!%*?&]{8,}$/,
      {
        message:
          "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character",
      },
    ),
  confirmPassword: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&])[A-Za-z\d@#$!%*?&]{8,}$/,
      {
        message:
          "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character",
      },
    ),
});

module.exports = {
  signUpSchema,
  signInSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
};
