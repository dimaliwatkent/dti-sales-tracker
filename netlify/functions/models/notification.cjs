const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    title: String,
    message: String,
    type: {
      type: String,
      enum: ["info", "alert", "warning", "error", "success"],
      required: true,
    },
    severity: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "low",
    },
    read: Boolean,
  },
  { timestamps: true },
);

module.exports = mongoose.model("notification", NotificationSchema);
