const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
  },
  price: {
    type: mongoose.Schema.Types.Decimal128,
  },
  description: {
    type: String,
    trim: true,
  },
  picture: { type: String },
});

const BusinessSchema = new mongoose.Schema(
  {
    // Associations
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
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
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    region: {
      type: String,
      required: true,
      trim: true,
    },
    zip: {
      type: String,
      required: true,
      trim: true,
    },
    logo: { type: String },
    facebookPage: {
      type: String,
    },
    ecommerceSite: {
      type: String,
    },
    website: {
      type: String,
    },
    contactPersonName: {
      type: String,
      required: true,
      trim: true,
    },
    contactPersonNumber: {
      type: Number,
    },
    contactPersonDesignation: {
      type: String,
      required: true,
      trim: true,
    },
    contactPersonSex: {
      type: String,
    },
    paymentOption: {
      type: [String],
    },
    logisticServiceProvider: {
      type: [String],
    },
    industryClassification: {
      type: [String],
    },
    productLineService: {
      type: [String],
    },
    brandName: {
      type: String,
      trim: true,
      maxlength: [200, "Brand name cannot exceed 200 characters"],
    },
    category: {
      type: [String],
    },
    documentList: [
      {
        documentType: String,
        url: String,
      },
    ],
    type: {
      type: String,
      trim: true,
    },

    // Business Statistics
    assetSize: {
      type: String,
    },
    fulltimeEmployee: {
      type: Number,
    },
    parttimeEmployee: {
      type: Number,
    },
    dateOfEstablishment: {
      type: Date,
    },
    annualIncome: {
      type: Number,
    },

    // Status
    isOccupying: {
      type: Boolean,
      default: false,
    },
    boothNumber: {
      type: String,
    },
    applicationStatus: {
      type: String,
      default: "pending",
    },
    statusMessage: {
      type: String,
      trim: true,
      default: null,
    },
    productList: [productSchema],
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("business", BusinessSchema);
