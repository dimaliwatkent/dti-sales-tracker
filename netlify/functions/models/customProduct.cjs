const mongoose = require("mongoose");

const CustomProductSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      validate: {
        validator: function (v) {
          return mongoose.Types.ObjectId.isValid(v);
        },
        message: "Invalid business ObjectId",
      },
    },
    name: {
      type: String,
      trim: true,
      minlength: [3, "Name must be at least 3 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    categoryList: [
      {
        type: String,
        trim: true,
        minlength: [3, "Category must be at least 3 characters"],
        maxlength: [50, "Category cannot exceed 50 characters"],
      },
    ],
    price: {
      type: mongoose.Schema.Types.Decimal128,
      validate: {
        validator: function (v) {
          return v >= 0;
        },
        message: "Price must be a non-negative value",
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

module.exports = mongoose.model("CustomProduct", CustomProductSchema);
