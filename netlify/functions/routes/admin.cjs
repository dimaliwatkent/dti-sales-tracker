const express = require("express");
const Business = require("../models/business.cjs");
const User = require("../models/user.cjs");
const Product = require("../models/product.cjs");
const Sales = require("../models/sales.cjs");
const router = express.Router();

// Create a new business
router.post("/businesses", async (req, res) => {
  const { user, sales, products, name, owner, boothNumber } = req.body;
  const business = new Business({
    user,
    sales,
    products,
    name,
    owner,
    boothNumber,
  });
  await business.save();
  res.status(201).json(business);
});

// Get all businesses *** using
router.get("/businesses", async (req, res) => {
  const businesses = await Business.find()
    .populate("user")
    .populate("sales")
    .populate("products");
  res.json(businesses);
});

// Update a business
router.put("/businesses/:id", async (req, res) => {
  const { user, sales, products, name, owner } = req.body;
  const business = await Business.findByIdAndUpdate(
    req.params.id,
    { user, sales, products, name, owner },
    { new: true },
  );
  res.json(business);
});

// Delete a business
router.delete("/businesses/:id", async (req, res) => {
  await Business.findByIdAndDelete(req.params.id);
  res.json({ message: "Business deleted" });
});

// for tables in admin dashboard
// get single business with total and avg update

router.get("/businesses/:businessId", async (req, res) => {
  const { businessId } = req.params;

  try {
    // Fetch the business document
    const businessToUpdate = await Business.findById(businessId);

    if (!businessToUpdate) {
      return res.status(404).send("Business not found.");
    }

    // Find all sales documents associated with the business
    const salesDocs = await Sales.find({ business: businessId }).sort({
      createdAt: -1,
    });

    if (salesDocs.length === 0) {
      return res.status(404).send("No sales found for this business.");
    }

    // Initialize groupedByDay with all days of the week
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const groupedByDay = daysOfWeek.reduce((acc, day) => {
      acc[day] = { day: day, sales: 0 }; // Initialize with 0 sales
      return acc;
    }, {});

    // Group sales by day of the week and update total sales for each day
    salesDocs.forEach((saleDoc) => {
      const dayOfWeek = saleDoc.createdAt.getDay();
      groupedByDay[daysOfWeek[dayOfWeek]].sales += saleDoc.totalPrice;
    });

    // Convert days of the week to names
    const formattedData = Object.values(groupedByDay).map(({ day, sales }) => ({
      day: day,
      sales: sales,
    }));

    // Prepare data for Recharts LineChart
    const chartData = formattedData.map((item) => ({
      ...item,
      // day: item.day.toLowerCase(),
      day: item.day,
    }));

    // Calculate total sales and average daily sales
    const totalSales = salesDocs.reduce(
      (acc, saleDoc) => acc + saleDoc.totalPrice,
      0,
    );
    const averageDailySales = totalSales / salesDocs.length;

    // Update the business document with the new calculations
    businessToUpdate.overallSales = totalSales;
    businessToUpdate.dailySales = averageDailySales;

    // Save the updated business document
    await businessToUpdate.save();

    res.json({
      message: "Business sales updated successfully.",
      business: businessToUpdate,
      chartData: chartData, // Include chart data in the response
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while processing your request.");
  }
});

// Create a new user
router.post("/users", async (req, res) => {
  const { name, email, username, password, role, business } = req.body;
  const user = new User({ name, username, email, password, role, business });
  await user.save();
  res.status(201).json(user);
});

// Get all users
router.get("/users", async (req, res) => {
  const users = await User.find().populate("business");
  res.json(users);
});

// Get a single user
router.get("/users/:id", async (req, res) => {
  const user = await User.findById(req.params.id).populate("business");
  res.json(user);
});

// Update a user
router.put("/users/:id", async (req, res) => {
  const { name, username, password, role, business } = req.body;
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { name, username, password, role, business },
    { new: true },
  );
  res.json(user);
});

// Delete a user
router.delete("/users/:id", async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted" });
});

module.exports = router;
