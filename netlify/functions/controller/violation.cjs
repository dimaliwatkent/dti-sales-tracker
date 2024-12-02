const Violation = require("../models/violation.cjs");
const mongoose = require("mongoose");

// handle error
const handleError = (res, err) => {
  return res
    .status(500)
    .json({ message: "An error occurred", err: err.message });
};

// get all violations
const getViolationList = async (req, res) => {
  try {
    const isArchived = req.query.isArchived === "true";
    const violation = await Violation.find({ isArchived });

    if (!violation.length) {
      return res.status(404).json({ message: "No violations found" });
    }

    return res
      .status(200)
      .json({ message: "Violations retrieved successfully", violation });
  } catch (err) {
    handleError(res, err);
  }
};

// get violation by id
const getViolation = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid violation ID" });
    }

    const violation = await Violation.findById(id);

    if (!violation) {
      return res.status(404).json({ message: "No violation found" });
    }

    return res
      .status(200)
      .json({ message: "Violation retrieved successfully", violation });
  } catch (err) {
    handleError(res, err);
  }
};

// create violation
const createViolation = async (req, res) => {
  try {
    const { name, fee, description } = req.body;
    const existingViolation = await Violation.findOne({ name });

    if (existingViolation) {
      return res.status(409).json({ message: "Violation already exists" });
    }

    const newViolation = new Violation({
      name,
      fee,
      description,
    });

    await newViolation.save();

    return res.status(201).json({
      message: "Violation created successfully",
      violation: newViolation,
    });
  } catch (err) {
    handleError(res, err);
  }
};

// update violation
const updateViolation = async (req, res) => {
  try {
    const { violationId } = req.params;
    const { name, fee, description } = req.body;

    if (!violationId || !mongoose.isValidObjectId(violationId)) {
      return res.status(400).json({ message: "Invalid award ID" });
    }

    const existingViolation = await Violation.findById(violationId);

    if (!existingViolation) {
      return res.status(404).json({ message: "No violation found" });
    }

    existingViolation.name = name;
    existingViolation.fee = fee;
    existingViolation.description = description;

    await existingViolation.save();

    return res.status(200).json({
      message: "Violation updated successfully",
      violation: existingViolation,
    });
  } catch (err) {
    handleError(res, err);
  }
};

// archive violation
const archiveViolation = async (req, res) => {
  try {
    const { id } = req.params;
    const { isArchived } = req.body;

    if (!id || !mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid violation ID" });
    }

    const existingViolation = await Violation.findById(id);

    if (!existingViolation) {
      return res.status(404).json({ message: "No violation found" });
    }

    existingViolation.isArchived = isArchived;
    await existingViolation.save();

    const action = isArchived ? "archived" : "unarchived";

    return res.status(200).json({
      message: `Violation ${action} successfully`,
      violation: existingViolation,
    });
  } catch (err) {
    handleError(res, err);
  }
};

module.exports = {
  getViolationList,
  getViolation,
  createViolation,
  updateViolation,
  archiveViolation,
};
