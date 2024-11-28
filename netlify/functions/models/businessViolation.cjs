const mongoose = require("mongoose");

const businessViolationsSchema = new mongoose.Schema(
  {
    business: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "business",
      validate: {
        validator: function (v) {
          return mongoose.Types.ObjectId.isValid(v);
        },
        message: "Invalid business ObjectId",
      },
    },
    violation: {
      type: new mongoose.Schema({
        name: {
          type: String,
        },
        fee: {
          type: Number,
        },
        description: {
          type: String,
        },
      }),
    },
    monitor: {
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
    imageProof: {
      type: String,
    },
    count: {
      type: Number,
    },
    isPaid: {
      type: Boolean,
      default: false,
      validate: {
        validator: function (v) {
          return typeof v === "boolean";
        },
        message: "isPaid must be a boolean value",
      },
    },
    datePaid: {
      type: Date,
      validate: {
        validator: function (v) {
          if (!this.isPaid) return true; // Allow null if not paid
          const violationDate = this.violationDate || Date.now();
          return v >= violationDate;
        },
        message: "Payment date cannot be before violation date",
      },
    },
    violationDate: {
      type: Date,
      default: Date.now,
      validate: {
        validator: function (v) {
          const currentYear = new Date().getFullYear();
          return v.getFullYear() <= currentYear;
        },
        message: "Violation date cannot be in the future",
      },
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

module.exports = mongoose.model("businessViolation", businessViolationsSchema);
