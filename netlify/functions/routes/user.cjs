const express = require("express");
const router = express.Router();
const Sales = require("../models/sales.cjs");
const Product = require("../models/product.cjs");
const Business = require("../models/business.cjs");

// when accessing the sales data it automatically makes 1 sale per day
router.get("/sales/:businessId", async (req, res) => {
  try {
    const businessId = req.params.businessId;
    const business = await Business.findById(businessId);
    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    // Adjusted to check for sales on the current date only
    const currentDate = new Date();
    const startOfCurrentDay = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
    );
    const endOfCurrentDay = new Date(
      startOfCurrentDay.getTime() + 24 * 60 * 60 * 1000,
    ); // End of the current day

    const existingSaleToday = await Sales.findOne({
      business: business._id,
      createdAt: {
        $gte: startOfCurrentDay,
        $lt: endOfCurrentDay,
      },
    }).populate("products.productId");

    let sale;
    if (existingSaleToday) {
      sale = existingSaleToday;
    } else {
      sale = new Sales({
        business: business._id,
        products: [],
        totalPrice: 0,
      });
      await sale.save();

      business.sales.push(sale._id);
      await business.save();
    }

    res.status(201).json({ message: "Sale created successfully", sale });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// not using
router.put("/sales/:saleId", async (req, res) => {
  try {
    const { totalPrice, products } = req.body;
    const saleId = req.params.saleId;

    // Authenticate the user here (this is just a placeholder)

    const sale = await Sales.findById(saleId);
    if (!sale) {
      return res.status(404).json({ message: "Sale not found" });
    }

    // Update the sale
    sale.totalPrice = totalPrice;
    sale.products = products; // Assuming you want to replace the entire array; adjust as needed

    await sale.save();
    res.status(200).json({ message: "Sale updated successfully", sale });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// adds product to the sale
router.post("/sales/addproduct", async (req, res) => {
  try {
    const { saleId, productId, quantity } = req.body;

    if (!saleId || !productId || !quantity) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Find the sale by ID
    const sale = await Sales.findById(saleId);
    if (!sale) {
      return res.status(404).json({ error: "Sale not found" });
    }

    // Search for the product by ID to get its price
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Check if the product exists in the sale
    const existingProductIndex = sale.products.findIndex(
      (productInSale) =>
        productInSale.productId.toString() === productId.toString(),
    );

    if (existingProductIndex >= 0) {
      // Increment the quantity of the existing product
      sale.products[existingProductIndex].quantity += quantity;
    } else {
      // Add the product to the sale
      sale.products.push({
        productId,
        quantity,
      });
    }
    // Calculate the new total price including the added product
    const newTotalPrice = sale.totalPrice + product.price * quantity;

    // Update the total price
    sale.totalPrice = newTotalPrice;

    // Save the updated sale
    await sale.save();

    res.status(200).json({
      message: "Product successfully added to the sale",
      totalPrice: sale.totalPrice,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete product from sale route
router.delete("/sales/removeproduct", async (req, res) => {
  try {
    const { saleId, productId } = req.body;

    // Validate input
    if (!saleId || !productId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Find the sale by ID
    const sale = await Sales.findById(saleId);
    if (!sale) {
      return res.status(404).json({ error: "Sale not found" });
    }

    // Find the product by ID
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Remove the product from the sale
    const productIndex = sale.products.findIndex(
      (productInSale) =>
        productInSale.productId.toString() === productId.toString(),
    );

    if (productIndex < 0) {
      return res.status(400).json({ error: "Product not found in the sale" });
    }

    // Calculate the new total price after removing the product
    const newTotalPrice =
      sale.totalPrice - product.price * sale.products[productIndex].quantity;

    // Remove the product from the sale array
    sale.products.splice(productIndex, 1);

    // Update the total price
    sale.totalPrice = newTotalPrice;

    // Save the updated sale
    await sale.save();

    res.status(200).json({
      message: "Product successfully removed from the sale",
      totalPrice: newTotalPrice,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// provides product list
router.get("/products/:businessId", async (req, res) => {
  try {
    const businessId = req.params.businessId;
    const business = await Business.findById(businessId);
    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    // Find all products associated with the business
    const products = await Product.find({ business: businessId });
    if (products.length === 0) {
      return res
        .status(404)
        .json({ message: "No products found for this business" });
    }

    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// add products
router.post("/products/:businessId", async (req, res) => {
  try {
    const { name, price, under_nego } = req.body;

    const business = await Business.findById(req.params.businessId);
    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    const product = new Product({
      name,
      price,
      under_nego,
      business: business._id,
    });

    await product.save();

    business.products.push(product._id);
    await business.save();

    res.status(201).json({ message: "Product added successfully", product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete product
router.delete(
  "/products/removeproduct/:businessId/:productId",
  async (req, res) => {
    try {
      const { businessId, productId } = req.params;
      const business = await Business.findById(businessId);

      if (!business) {
        return res.status(404).json({ message: "Business not found" });
      }

      const productIndex = business.products.indexOf(productId);
      if (productIndex === -1) {
        return res
          .status(404)
          .json({ message: "Product not found in the business's products" });
      }

      business.products.splice(productIndex, 1); // Remove the product ID from the business's products array
      await business.save();

      // Optionally, delete the product document if it's no longer needed elsewhere
      const product = await Product.findByIdAndDelete(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.status(200).json({ message: "Product removed successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message });
    }
  },
);

module.exports = router;
