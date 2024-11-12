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
  getBusinessViolationList,
  getBusinessViolation,
  createBusinessViolation,
  payBusinessViolation,
};
