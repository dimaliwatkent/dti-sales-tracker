const { z } = require("zod");

const addEventSchema = z.object({
  title: z.string().min(3, { message: "Title is required" }),
  location: z.string().min(3, { message: "Location is required" }),
  startDate: z.string().min(1, { message: "Start date is required" }),
  endDate: z.string().min(1, { message: "End date is required" }),

  applicationStart: z
    .string()
    .min(1, { message: "Application Start date is required" }),
  applicationEnd: z
    .string()
    .min(1, { message: "Application End date is required" }),
  status: z.string().refine(
    (value) => {
      return [
        "applicationOpen",
        "upcoming",
        "ongoing",
        "completed",
        "cancelled",
        "postponed",
      ].includes(value);
    },
    { message: "Invalid status" },
  ),
  businessList: z.array(z.unknown()).optional(),
  applicantList: z.array(z.unknown()).optional(),
  documentList: z.array(z.unknown()).optional(),
  isLocal: z.boolean(),
  boothList: z.array(z.unknown()).optional(),
});

module.exports = { addEventSchema };
