const mongoose = require("mongoose");

const BusinessSchema = new mongoose.Schema(
  {
    // Associations
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      validate: {
        validator: function (v) {
          return mongoose.Types.ObjectId.isValid(v);
        },
        message: "Invalid user ObjectId",
      },
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "event",
    },

    saleList: [{ type: mongoose.Schema.Types.ObjectId, ref: "sale" }],
    violationList: [
      { type: mongoose.Schema.Types.ObjectId, ref: "businessViolation" },
    ],
    awardList: [
      { type: mongoose.Schema.Types.ObjectId, ref: "businessAwards" },
    ],

    // Business Details
    name: {
      type: String,
      trim: true,
      minlength: [3, "Business name must be at least 3 characters"],
      maxlength: [50, "Business name cannot exceed 50 characters"],
    },
    address: {
      type: String,
      required: true,
      trim: true,
      minlength: [10, "Business address must be at least 10 characters"],
      maxlength: [200, "Business address cannot exceed 200 characters"],
    },
    region: {
      type: String,
      required: true,
      trim: true,
      minlength: [10, "Region must be at least 10 characters"],
      maxlength: [200, "Region cannot exceed 200 characters"],
    },
    zip: {
      type: String,
      required: true,
      trim: true,
      minlength: [4, "Zip code must be exactly 4 characters"],
      maxlength: [4, "Zip code must be exactly 4 characters"],
      match: [/^\d{4}$/, "Invalid zip code format"],
    },
    logo: { type: String },
    facebookPage: {
      type: String,
      validate: function (value) {
        if (!value) return true;
        const urlPattern =
          /^(http|https):\/\/www\.facebook\.com\/[a-zA-Z0-9.-]+/.test(value) ||
          "";
        return urlPattern.test(value);
      },
      message: "Invalid Facebook page URL",
    },
    ecommerceSite: {
      type: String,
      validate: function (value) {
        if (!value) return true;
        const urlPattern =
          /^(http|https):\/\/(www\.)?(lazada|shopee)\.[a-zA-Z]{2,4}\/[a-zA-Z0-9.-]+$/;
        return urlPattern.test(value);
      },
      message: "Invalid Lazada/Shopee site URL",
    },
    website: {
      type: String,
      validate: function (value) {
        if (!value) return true;
        const urlPattern =
          /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
        return urlPattern.test(value);
      },
      message: "Invalid website URL",
    },
    contactPersonName: {
      type: String,
      required: true,
      trim: true,
      minlength: [3, "Name must be at least 3 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    contactPersonNumber: {
      type: Number,
      validate: {
        validator: function (v) {
          return /^\d{10}$/.test(v);
        },
        message: "Phone number must be a 10-digit number",
      },
    },
    contactPersonDesignation: {
      type: String,
      required: true,
      trim: true,
      minlength: [3, "Designation must be at least 3 characters"],
      maxlength: [50, "Designation cannot exceed 50 characters"],
    },
    contactPersonSex: {
      type: String,
    },
    paymentOption: {
      type: [String],
      // trim: true,
      // validate: { validator: function (v) {
      //     return ["cash", "gcash", "maya", "none"].includes(v);
      //   },
      //   message: "Payment option must be cash, gcash, maya, or none",
      // },
    },
    logisticServiceProvider: {
      type: [String],
    },
    industryClassification: {
      type: [String],
      // trim: true,
      // validate: {
      //   validator: function (v) {
      //     return [
      //       "manufacturing",
      //       "service",
      //       "retail",
      //       "wholesale",
      //       "construction",
      //     ].includes(v);
      //   },
      //   message:
      //     "Industry classification must be manufacturing, service, retail, wholesale, or construction",
      // },
    },
    productLineService: {
      type: [String],
    },
    product: {
      type: String,
      trim: true,
      maxlength: [200, "Products cannot exceed 200 characters"],
    },
    brandName: {
      type: String,
      trim: true,
      maxlength: [200, "Brand name cannot exceed 200 characters"],
    },
    category: {
      type: [String],
      // trim: true,
      // validate: {
      //   validator: function (v) {
      //     return ["food", "non-food", "service"].includes(v);
      //   },
      //   message: "Category must be food, non-food, or service",
      // },
    },
    documentList: [
      {
        type: String,
        // required: true
      },
    ],
    type: {
      type: String,
      trim: true,
      // validate: {
      //   validator: function (v) {
      //     return [
      //       "sole proprietorship",
      //       "partnership",
      //       "corporation",
      //     ].includes(v);
      //   },
      //   message:
      //     "Sole must be sole proprietorship, partnership, or corporation",
      // },
    },

    // Business Statistics
    assetSize: {
      type: String,
    },
    targetSale: {
      type: Number,
      min: [0, "Target sales cannot be negative"],
      max: [1000000000, "Target sales cannot exceed 1 billion"],
    },
    fulltimeEmployee: {
      type: Number,
      min: [0, "Number of full-time employees cannot be negative"],
      max: [10000, "Number of full-time employees cannot exceed 10,000"],
    },
    parttimeEmployee: {
      type: Number,
      min: [0, "Number of part-time employees cannot be negative"],
      max: [10000, "Number of part-time employees cannot exceed 10,000"],
    },
    dateOfEstablishment: {
      type: Date,
      validate: {
        validator: function (v) {
          return v instanceof Date && !isNaN(v.getTime());
        },
        message: "Invalid date of establishment",
      },
    },
    annualIncome: {
      type: Number,
      min: [0, "Annual business income cannot be negative"],
      max: [1000000000, "Annual business income cannot exceed 1 billion"],
    },

    // Status
    isOccupying: {
      type: Boolean,
      default: false,
      validate: {
        validator: function (v) {
          return typeof v === "boolean";
        },
        message: "isOccupying must be a boolean value",
      },
    },
    boothNumber: {
      type: Number,
      default: 0,
      min: [0, "Booth number cannot be negative"],
    },
    applicationStatus: {
      type: String,
      default: "pending",
      validate: {
        validator: function (v) {
          return [
            "forcompletion",
            "pending",
            "approved",
            "rejected",
            "complied",
          ].includes(v.toLowerCase());
        },
        message:
          "applicationStatus must be pending, approved, rejected, or for completion",
      },
    },
    statusMessage: {
      type: String,
      trim: true,
      default: null,
      maxlength: [200, "Status message cannot exceed 200 characters"],
    },
    isArchived: {
      type: Boolean,
      default: false,
      validate: {
        validator: function (v) {
          return typeof v === "boolean";
        },
        message: "isArchived must be a boolean value",
      },
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("business", BusinessSchema);
