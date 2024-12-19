const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: {
    type: Number,
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
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "event",
    },
    transactionList: [TransactionSchema],
    totalAmount: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("sale", SaleSchema);
