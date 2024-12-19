const Event = require("../models/event.cjs");
const Business = require("../models/business.cjs");
const BusinessViolation = require("../models/businessViolation.cjs");
const Violation = require("../models/violation.cjs");
const mongoose = require("mongoose");

const { addNotification } = require("../controller/notification.cjs");

function getViolationMessage(violation) {
  if (violation.count === 1) {
    return "First Warning";
  } else if (violation.count === 2) {
    return "Second Warning";
  } else {
    return `Penalty P${violation.violation.fee * (violation.count - 2)}.00`;
  }
}

// get business list

const getBusinessListViolation = async (req, res, next) => {
  try {
    const { eventId } = req.params;

    if (!eventId || !mongoose.isValidObjectId(eventId)) {
      return res.status(400).json({ message: "Invalid event violation ID" });
    }

    const event = await Event.findById(eventId)
      .populate({
        path: "businessList",
        select: "_id name boothNumber violationList",
      })
      .exec();

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const filteredBusinessList = event.businessList.filter(
      (business) =>
        Array.isArray(business.violationList) &&
        business.violationList.length > 0,
    );

    return res.status(200).json({
      message: "Business violations retrieved successfully",
      businessList: filteredBusinessList,
      eventTitle: event.title,
    });
  } catch (error) {
    next(error);
  }
};

// API endpoint to add a violation to a business xxx
const addBusinessViolation = async (req, res, next) => {
  try {
    const businessId = req.params.businessId;
    const violation = req.body;

    const business = await Business.findById(businessId);
    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

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
        monitor: violation.monitor,
        message: violation.message,
        count: 1,
      });

      await newViolation.save();

      // Add the new business violation to the business's violation list
      business.violationList.push(newViolation._id);
      await business.save();

      const newBusiness = await Business.findById(businessId)
        .populate("violationList")
        .populate("event");

      const violationNotification = {
        userId: newBusiness.user,
        title: `Violation: ${newViolation.violation.name} for ${newBusiness.event.title}`,
        message: getViolationMessage(newViolation),
        type: "alert",
        severity: "low",
      };
      await addNotification(violationNotification);

      // Return a success response
      res.json({
        message: "Violation added successfully",
        business: newBusiness,
      });
    } else {
      // Increment the count of the existing business violation document
      existingViolation.count++;
      existingViolation.message = violation.message;
      await existingViolation.save();

      const newBusiness =
        await Business.findById(businessId).populate("violationList");

      const violationNotification = {
        userId: business.user,
        title: `Violation: ${existingViolation.violation.name} for ${newBusiness.event.title}`,
        message: getViolationMessage(existingViolation),
        type: "alert",
        severity: "low",
      };
      await addNotification(violationNotification);

      // Return a success response
      res.json({
        message: "Violation updated successfully",
        business: newBusiness,
      });
    }
  } catch (error) {
    next(error);
  }
};

// get violation list of business xxx
const getBusinessViolationList = async (req, res, next) => {
  try {
    const { businessId } = req.params;

    if (!businessId || !mongoose.isValidObjectId(businessId)) {
      return res.status(400).json({ message: "Invalid business violation ID" });
    }

    const business = await Business.findById(businessId)
      .select("_id name logo boothNumber violationList")
      .populate({
        path: "violationList",
        populate: { path: "monitor", select: "name" },
      })
      .exec();

    return res.status(200).json({
      message: "Business violations retrieved successfully",
      business,
    });
  } catch (error) {
    next(error);
  }
};

// mark violation as paid xxx
const markAsPaid = async (req, res, next) => {
  try {
    const { businessId } = req.params;
    const { violationIds } = req.body;

    if (!businessId || !mongoose.isValidObjectId(businessId)) {
      return res.status(400).json({ message: "Invalid business violation ID" });
    }

    if (
      !violationIds ||
      !Array.isArray(violationIds) ||
      violationIds.length === 0
    ) {
      return res
        .status(400)
        .json({ message: "Invalid or missing violation IDs" });
    }

    const updatedViolations = await BusinessViolation.updateMany(
      { _id: { $in: violationIds }, business: businessId },
      { $set: { isPaid: true, datePaid: new Date() } },
    );

    if (updatedViolations.nModified === 0) {
      return res
        .status(404)
        .json({ message: "No violations found or updated" });
    }

    return res.status(200).json({
      message: "Violations marked as paid successfully",
      updatedCount: updatedViolations.nModified,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBusinessListViolation,
  addBusinessViolation,
  getBusinessViolationList,
  markAsPaid,
};
