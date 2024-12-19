const mongoose = require("mongoose");

const CustomProductSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "event",
    },

    name: {
      type: String,
      trim: true,
    },
    price: {
      type: mongoose.Schema.Types.Decimal128,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("CustomProduct", CustomProductSchema);
