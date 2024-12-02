const Business = require("../models/business.cjs");
const Award = require("../models/award.cjs");
const BusinessAwards = require("../models/businessAward.cjs");
const mongoose = require("mongoose");

// handle error
const handleError = (res, err) => {
  return res
    .status(500)
    .json({ message: "An error occurred", err: err.message });
};

// get all business awards
const getBusinessAwardList = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid businessAward ID" });
    }

    const businessAward = await BusinessAwards.find({ business: id });

    if (!businessAward.length) {
      return res.status(404).json({ message: "No business awards found" });
    }
    return res.status(200).json({
      message: "Business awards retrieved successfully",
      businessAward,
    });
  } catch (err) {
    handleError(res, err);
  }
};

// get business awards by id
const getBusinessAward = async (req, res) => {
  try {
    const { businessId } = req.params;

    if (!businessId || !mongoose.isValidObjectId(businessId)) {
      return res.status(400).json({ message: "Invalid businessAward ID" });
    }

    const businessAward = await BusinessAwards.findById(businessId);

    if (!businessAward) {
      return res.status(404).json({ message: "No business award found" });
    }
    return res
      .status(200)
      .json({
        message: "Business award retrieved successfully",
        businessAward,
      });
  } catch (err) {
    handleError(res, err);
  }
};

// create business award
const createBusinessAward = async (req, res) => {
  try {
    // business id is required
    const { id } = req.params;
    const { awardId } = req.body;

    if (!id || !mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid business ID" });
    }

    if (!awardId || !mongoose.isValidObjectId(awardId)) {
      return res.status(400).json({ message: "Invalid award ID" });
    }

    const existingAward = await Award.findById(awardId);
    const existingBusiness = await Business.findById(id);

    if (!existingAward) {
      return res.status(404).json({ message: "Award not found" });
    }

    if (!existingBusiness) {
      return res.status(404).json({ message: "Business not found" });
    }

    const newBusinessAward = new BusinessAwards({
      award: awardId,
      business: id,
    });

    await newBusinessAward.save();

    existingBusiness.awardList.push(newBusinessAward);

    await existingBusiness.save();

    return res.status(201).json({
      message: "Business award created successfully",
      businessAward: newBusinessAward,
    });
  } catch (err) {
    handleError(res, err);
  }
};

// update business award
const updateBusinessAward = async (req, res) => {
  try {
    const { businessAwardId } = req.params;
    const { awardId, businessId } = req.body;

    if (!businessAwardId || !mongoose.isValidObjectId(businessAwardId)) {
      return res.status(400).json({ message: "Invalid business award ID" });
    }

    if (!awardId || !mongoose.isValidObjectId(awardId)) {
      return res.status(400).json({ message: "Invalid award ID" });
    }

    if (!businessId || !mongoose.isValidObjectId(businessId)) {
      return res.status(400).json({ message: "Invalid business ID" });
    }

    const existingBusinessAward =
      await BusinessAwards.findById(businessAwardId);
    const existingAward = await Award.findById(awardId);
    const existingBusiness = await Business.findById(businessId);

    if (!existingBusinessAward) {
      return res.status(404).json({ message: "Business award not found" });
    }
    if (!existingAward) {
      return res.status(404).json({ message: "Award not found" });
    }
    if (!existingBusiness) {
      return res.status(404).json({ message: "Business not found" });
    }

    existingBusinessAward.awardList = awardId;
    existingBusinessAward.business = businessId;
    await existingBusinessAward.save();

    return res.status(200).json({
      message: "Business award updated successfully",
      businessAward: existingBusinessAward,
    });
  } catch (err) {
    handleError(res, err);
  }
};

// archive business award
const archiveBusinessAward = async (req, res) => {
  try {
    // business award id is required
    const { id } = req.params;
    const { isArchived } = req.body;

    if (!id || !mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid business award ID" });
    }

    const existingBusinessAward = await BusinessAwards.findById(id);

    if (!existingBusinessAward) {
      return res.status(404).json({ message: "No business award found" });
    }

    existingBusinessAward.isArchived = isArchived;
    await existingBusinessAward.save();

    const action = isArchived ? "archived" : "unarchived";

    return res.status(200).json({
      message: `Business award ${action} successfully`,
      businessAward: existingBusinessAward,
    });
  } catch (err) {
    handleError(res, err);
  }
};

// is awarded
const isAwarded = async (req, res) => {
  try {
    const { businessAwardId } = req.params;
    const { isAwarded } = req.body;
    const existingBusinessAward =
      await BusinessAwards.findById(businessAwardId);

    if (!existingBusinessAward) {
      return res.status(404).json({ message: "No business award found" });
    }

    await BusinessAwards.findByIdAndUpdate(
      businessAwardId,
      {
        isAwarded,
        updatedAt: Date.now(),
      },
      { new: true },
    );

    return res.status(200).json({
      message: "Business awarded successfully",
      businessAward: existingBusinessAward,
    });
  } catch (err) {
    handleError(res, err);
  }
};

module.exports = {
  getBusinessAwardList,
  getBusinessAward,
  createBusinessAward,
  updateBusinessAward,
  archiveBusinessAward,
};
