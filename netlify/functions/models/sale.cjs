const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: {
    type: Number,
    min: [1, "Quantity cannot be less than 1"],
    validate: {
      validator: function (v) {
        return typeof v === "number" && !isNaN(v);
      },
      message: "Quantity must be a valid number",
    },
  },
  price: { type: mongoose.Schema.Types.Decimal128, required: true },
});

const TransactionSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  paymentMethod: { type: String, required: true },
  totalAmount: {
    type: mongoose.Schema.Types.Decimal128,
    required: true,
  },
  productList: [ProductSchema],
});

const SaleSchema = new mongoose.Schema(
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
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "event",
      validate: {
        validator: function (v) {
          return mongoose.Types.ObjectId.isValid(v);
        },
        message: "Invalid event ObjectId",
      },
    },
    transactionList: [TransactionSchema],
    totalAmount: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
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

module.exports = mongoose.model("sale", SaleSchema);
