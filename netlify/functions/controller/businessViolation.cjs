const Business = require("../models/business.cjs");
const BusinessViolation = require("../models/businessViolation.cjs");
const Violation = require("../models/violation.cjs");
const mongoose = require("mongoose");

// handle error
const handleError = (res, err) => {
  return res
    .status(500)
    .cjson({ message: "An error occurred", err: err.message });
};

// API endpoint to add a violation to a business xxx
const addBusinessViolation = async (req, res) => {
  try {
    // Get the business ID from the URL parameter
    const businessId = req.params.businessId;

    // Get the violation from the request body
    const violation = req.body;

    // Check if the business exists
    const business = await Business.findById(businessId);
    if (!business) {
      return res.status(404).cjson({ message: "Business not found" });
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
      res.cjson({
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
      res.cjson({
        message: "Violation count incremented successfully",
        business: newBusiness,
      });
    }
  } catch (error) {
    // Return an error response
    res.status(500).cjson({ message: "Error adding violation" });
  }
};

// get violation list of business xxx
const getBusinessViolationList = async (req, res) => {
  try {
    const { businessId } = req.params;

    if (!businessId || !mongoose.isValidObjectId(businessId)) {
      return res
        .status(400)
        .cjson({ message: "Invalid business violation ID" });
    }

    const violationList = await BusinessViolation.find({
      business: businessId,
    });

    return res.status(200).cjson({
      message: "Business violations retrieved successfully",
      violationList,
    });
  } catch (err) {
    handleError(res, err);
  }
};

// mark violation as paid xxx
const markAsPaid = async (req, res) => {
  try {
    const { businessId } = req.params;
    const { violationIds } = req.body;

    if (!businessId || !mongoose.isValidObjectId(businessId)) {
      return res
        .status(400)
        .cjson({ message: "Invalid business violation ID" });
    }

    if (
      !violationIds ||
      !Array.isArray(violationIds) ||
      violationIds.length === 0
    ) {
      return res
        .status(400)
        .cjson({ message: "Invalid or missing violation IDs" });
    }

    const updatedViolations = await BusinessViolation.updateMany(
      { _id: { $in: violationIds }, business: businessId },
      { $set: { isPaid: true, datePaid: new Date() } },
    );

    if (updatedViolations.nModified === 0) {
      return res
        .status(404)
        .cjson({ message: "No violations found or updated" });
    }

    return res.status(200).cjson({
      message: "Violations marked as paid successfully",
      updatedCount: updatedViolations.nModified,
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
      return res
        .status(400)
        .cjson({ message: "Invalid business violation ID" });
    }

    const businessViolation =
      await BusinessViolation.findById(businessViolationId);

    if (!businessViolation) {
      return res.status(404).cjson({ message: "No business violation found" });
    }

    return res.status(200).cjson({
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
      return res.status(400).cjson({ message: "Invalid business ID" });
    }

    if (!violationId || !mongoose.isValidObjectId(violationId)) {
      return res.status(400).cjson({ message: "Invalid violation ID" });
    }

    const existingBusiness = await Business.findById(businessId);
    const existingViolation = await Violation.findById(violationId);

    if (!existingBusiness) {
      return res.status(404).cjson({ message: "No business found" });
    }
    if (!existingViolation) {
      return res.status(404).cjson({ message: "No violation found" });
    }

    const newBusinessViolation = new BusinessViolation({
      business: businessId,
      violation: violationId,
      imageProof,
    });

    await newBusinessViolation.save();

    existingBusiness.violationList.push(newBusinessViolation._id);
    await existingBusiness.save();

    return res.status(201).cjson({
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
      return res
        .status(400)
        .cjson({ message: "Invalid business violation ID" });
    }

    const existingBusinessViolation = await BusinessViolation.findById(id);

    if (!existingBusinessViolation) {
      return res.status(404).cjson({ message: "No business violation found" });
    }

    existingBusinessViolation.isPaid = true;
    existingBusinessViolation.datePaid = Date.now();
    await existingBusinessViolation.save();

    return res.status(200).cjson({
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
  markAsPaid,
};
