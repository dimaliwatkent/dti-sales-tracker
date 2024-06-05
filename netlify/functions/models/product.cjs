const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    under_nego: { type: Boolean, required: true },
    business: { type: mongoose.Schema.Types.ObjectId, ref: "Business" },
  },
  { timestamps: true },
);

const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;
