const mongoose = require("mongoose");

const ViolationSchema = new mongoose.Schema(
  {
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: "event" },
    name: {
      type: String,
      trim: true,
    },
    fee: {
      type: Number,
    },
    description: {
      type: String,
      trim: true,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("violation", ViolationSchema);
