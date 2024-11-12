const Award = require("../models/award.cjs");
const mongoose = require("mongoose");

// handle error
const handleError = (res, err) => {
  return res
    .status(500)
    .json({ message: "An error occurred", err: err.message });
};

// Get all awards
const getAwardList = async (req, res) => {
  try {
    const isArchived = req.query.isArchived === "true";
    const award = await Award.find({ isArchived });
    if (!award.length) {
      return res.status(404).json({ message: "No award found" });
    }
    return res
      .status(200)
      .json({ message: "Awards retrieved successfully", award });
  } catch (err) {
    handleError(res, err);
  }
};

// Get award by id
const getAward = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid award ID" });
    }

    const award = await Award.findById(id);

    if (!award) {
      return res.status(404).json({ message: "No award found" });
    }

    return res
      .status(200)
      .json({ message: "Award retrieved successfully", award });
  } catch (err) {
    handleError(res, err);
  }
};

// Add award
const createAward = async (req, res) => {
  try {
    const { name, description, prize } = req.body;

    if (!name || !description || !prize) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingAward = await Award.findOne({ name });

    if (existingAward) {
      return res
        .status(409)
        .json({ message: "Award with this name already exists" });
    }

    const newAward = new Award({
      name: name.trim(),
      description: description.trim(),
      prize: prize.trim(),
    });

    await newAward.save();

    return res
      .status(201)
      .json({ message: "Award created successfully", award: newAward });
  } catch (err) {
    handleError(res, err);
  }
};
// Update award
const updateAward = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, prize } = req.body;

    if (!id || !mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid award ID" });
    }

    const existingAward = await Award.findById(id);

    if (!existingAward) {
      return res.status(404).json({ message: "No award found" });
    }

    existingAward.name = name;
    existingAward.description = description;
    existingAward.prize = prize;
    await existingAward.save();

    return res
      .status(200)
      .json({ message: "Award updated successfully", award: existingAward });
  } catch (err) {
    handleError(res, err);
  }
};

// Archive award
const archiveAward = async (req, res) => {
  try {
    const { id } = req.params;
    const { isArchived } = req.body;

    if (!id || !mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid award ID" });
    }

    const award = await Award.findById(id);

    if (!award) {
      return res.status(404).json({ message: "No award found" });
    }

    award.isArchived = isArchived;

    const action = isArchived ? "archived" : "unarchived";

    return res
      .status(200)
      .json({ message: `Award ${action} successfully`, award });
  } catch (err) {
    handleError(res, err);
  }
};

module.exports = {
  getAwardList,
  getAward,
  createAward,
  updateAward,
  archiveAward,
};
