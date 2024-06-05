const mongoose = require("mongoose");

const BusinessSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    sales: [{ type: mongoose.Schema.Types.ObjectId, ref: "Sales" }],
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    name: { type: String, required: true },
    owner: { type: String, required: true },
    boothNumber: { type: String },
    overallSales: { type: Number },
    dailySales: { type: Number },
  },
  { timestamps: true },
);

const Business = mongoose.model("Business", BusinessSchema);
module.exports = Business;
