const Business = require("../models/business.cjs");
const BusinessViolation = require("../models/businessViolation.cjs");
const Violation = require("../models/violation.cjs");
const mongoose = require("mongoose");

// handle error
const handleError = (res, err) => {
  return res
    .status(500)
    .json({ message: "An error occurred", err: err.message });
};

// API endpoint to add a violation to a business
const addBusinessViolation = async (req, res) => {
  try {
    // Get the business ID from the URL parameter
    const businessId = req.params.businessId;

    // Get the violation from the request body
    const violation = req.body;

    // Check if the business exists
    const business = await Business.findById(businessId);
    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    // Check if the violation already exists in the business
    const existingViolation = await BusinessViolation.findOne({
      business: businessId,
      "violation.name": violation.name,
    });

    if (!existingViolation) {
      // Create a new business violation document
      const newViolation = new BusinessViolation({
        business: businessId,
        violation: {
          name: violation.name,
          fee: violation.fee,
          description: violation.description,
        },
        monitor: violation.monitor, // Assuming the monitor is the current user
        count: 1,
      });

      // Save the new business violation document
      await newViolation.save();

      // Add the new business violation to the business's violation list
      business.violationList.push(newViolation._id);
      await business.save();

      const newBusiness =
        await Business.findById(businessId).populate("violationList");

      // Return a success response
      res.json({
        message: "Violation added successfully",
        business: newBusiness,
      });
    } else {
      // Increment the count of the existing business violation document
      existingViolation.count++;
      await existingViolation.save();

      const newBusiness =
        await Business.findById(businessId).populate("violationList");

      // Return a success response
      res.json({
        message: "Violation count incremented successfully",
        business: newBusiness,
      });
    }
  } catch (error) {
    // Return an error response
    res.status(500).json({ message: "Error adding violation" });
  }
};

// get all businesses
const getBusinessViolationList = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid business violation ID" });
    }

    const businessViolations = await BusinessViolation.find({
      business: id,
    });

    if (!businessViolations.length) {
      return res.status(404).json({ message: "No business violations found" });
    }
    return res.status(200).json({
      message: "Business violations retrieved successfully",
      businessViolations,
    });
  } catch (err) {
    handleError(res, err);
  }
};

// get business violation by id
const getBusinessViolation = async (req, res) => {
  try {
    const { businessViolationId } = req.params;

    if (
      !businessViolationId ||
      !mongoose.isValidObjectId(businessViolationId)
    ) {
      return res.status(400).json({ message: "Invalid business violation ID" });
    }

    const businessViolation =
      await BusinessViolation.findById(businessViolationId);

    if (!businessViolation) {
      return res.status(404).json({ message: "No business violation found" });
    }

    return res.status(200).json({
      message: "Business violation retrieved successfully",
      businessViolation,
    });
  } catch (err) {
    handleError(res, err);
  }
};

// create business violation
const createBusinessViolation = async (req, res) => {
  try {
    const { businessId } = req.params;
    const { violationId, imageProof } = req.body;

    if (!businessId || !mongoose.isValidObjectId(businessId)) {
      return res.status(400).json({ message: "Invalid business ID" });
    }

    if (!violationId || !mongoose.isValidObjectId(violationId)) {
      return res.status(400).json({ message: "Invalid violation ID" });
    }

    const existingBusiness = await Business.findById(businessId);
    const existingViolation = await Violation.findById(violationId);

    if (!existingBusiness) {
      return res.status(404).json({ message: "No business found" });
    }
    if (!existingViolation) {
      return res.status(404).json({ message: "No violation found" });
    }

    const newBusinessViolation = new BusinessViolation({
      business: businessId,
      violation: violationId,
      imageProof,
    });

    await newBusinessViolation.save();

    existingBusiness.violationList.push(newBusinessViolation._id);
    await existingBusiness.save();

    return res.status(201).json({
      message: "Business violation created successfully",
      businessViolation: newBusinessViolation,
    });
  } catch (err) {
    handleError(res, err);
  }
};

// pay business violation
const payBusinessViolation = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid business violation ID" });
    }

    const existingBusinessViolation = await BusinessViolation.findById(id);

    if (!existingBusinessViolation) {
      return res.status(404).json({ message: "No business violation found" });
    }

    existingBusinessViolation.isPaid = true;
    existingBusinessViolation.datePaid = Date.now();
    await existingBusinessViolation.save();

    return res.status(200).json({
      message: "Business violation paid successfully",
      businessViolation: existingBusinessViolation,
    });
  } catch (err) {
    handleError(res, err);
  }
};

module.exports = {
  addBusinessViolation,
  getBusinessViolationList,
  getBusinessViolation,
  createBusinessViolation,
  payBusinessViolation,
};
