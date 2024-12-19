const mongoose = require("mongoose");

const businessViolationsSchema = new mongoose.Schema(
  {
    business: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "business",
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
    },
    message: {
      type: String,
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
    },
    datePaid: {
      type: Date,
    },
    violationDate: {
      type: Date,
      default: Date.now,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("businessViolation", businessViolationsSchema);
