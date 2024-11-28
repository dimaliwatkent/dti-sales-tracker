const mongoose = require("mongoose");

const ViolationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      minlength: [3, "Violation name must be at least 3 characters"],
      maxlength: [50, "Violation name cannot exceed 50 characters"],
      validate: {
        validator: function (v) {
          return /^[a-zA-Z0-9\s.,!?-]+$/.test(v);
        },
        message:
          "Violation name should only contain letters, numbers, spaces, and common punctuation marks",
      },
    },
    fee: {
      type: Number,
    },
    description: {
      type: String,
      trim: true,
      minlength: [10, "Violation description must be at least 10 characters"],
      maxlength: [500, "Violation description cannot exceed 500 characters"],
      validate: {
        validator: function (v) {
          return /^[a-zA-Z0-9\s.,!?-]+$/.test(v);
        },
        message:
          "Violation description should only contain letters, numbers, spaces, and common punctuation marks",
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

module.exports = mongoose.model("violation", ViolationSchema);
