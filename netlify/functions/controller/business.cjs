const Business = require("../models/business.cjs");
const User = require("../models/user.cjs");
const Event = require("../models/event.cjs");
const mongoose = require("mongoose");

// handle error
const handleError = (res, err) => {
  return res
    .status(500)
    .json({ message: "An error occurred", err: err.message });
};

// get business by id
const getBusiness = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid business ID" });
    }

    const business = await Business.findById(id);

    console.log(id);

    if (!business) {
      return res.status(404).json({ message: "No business found" });
    }

    return res
      .status(200)
      .json({ message: "Business retrieved successfully", business });
  } catch (err) {
    handleError(res, err);
  }
};

// get archived business list
const getBusinessList = async (req, res) => {
  try {
    const isArchived = req.query.isArchived === "true";
    const business = await Business.find({ isArchived })
      .populate("user")
      .exec();

    if (!business || !business.length) {
      return res.status(404).json({ message: "No business found" });
    }

    return res
      .status(200)
      .json({ message: "Business list retrieved successfully", business });
  } catch (err) {
    handleError(res, err);
  }
};

// create business
const addBusiness = async (req, res) => {
  try {
    const { eventId, userId, ...businessData } = req.body;

    if (!userId || !mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    if (!eventId || !mongoose.isValidObjectId(eventId)) {
      return res.status(400).json({ message: "Invalid event ID" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.role !== "user") {
      return res
        .status(404)
        .json({ message: "Must be a user to add business" });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const newBusiness = new Business({
      ...businessData,
      user: user._id,
      event: eventId,
    });

    await newBusiness.save();

    user.businessList = [...(user.businessList || []), newBusiness._id];
    await user.save();

    // Add the business ID to the event's applicant list
    if (!event.applicantList.includes(newBusiness._id)) {
      event.applicantList = [...(event.applicantList || []), newBusiness._id];
      await event.save();
    }

    return res.status(201).json({
      message: "Business created successfully",
      business: newBusiness,
    });
  } catch (err) {
    handleError(res, err);
  }
};

const editBusiness = async (req, res) => {
  try {
    const { id } = req.params;
    const businessData = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid business ID" });
    }

    const business = await Business.findById(id);
    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    const updatedBusiness = { ...business.toObject(), ...businessData };

    const result = await Business.updateOne(
      { _id: id },
      { $set: updatedBusiness },
      { new: true },
    );
    if (result.nModified === 0) {
      return res.status(500).json({ message: "Failed to update business" });
    }

    return res.status(200).json({
      message: "Business updated successfully",
      business: updatedBusiness,
    });
  } catch (err) {
    handleError(res, err);
  }
};

// edit business
// const editBusiness = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { isAdmin, userId } = req.body;
//
//     if (!id || !mongoose.isValidObjectId(id)) {
//       return res.status(400).json({ message: "Invalid business ID" });
//     }
//
//     if (!userId || !mongoose.isValidObjectId(userId)) {
//       return res.status(400).json({ message: "Invalid user ID" });
//     }
//
//     const business = await Business.findById(id);
//     if (!business) {
//       return res.status(404).json({ message: "Business not found" });
//     }
//
//     if (business.applicationStatus === "approved" && !isAdmin) {
//       return res
//         .status(403)
//         .json({ message: "Only admins can edit approved businesses" });
//     }
//
//     const updatedBusinessData = {
//       ...req.body,
//       user: userId,
//     };
//     delete updatedBusinessData.isAdmin;
//
//     Object.assign(business, updatedBusinessData);
//     await business.save();
//
//     res
//       .status(200)
//       .json({ message: "Business updated successfully", business });
//   } catch (err) {
//     handleError(res, err);
//   }
// };

// business application
const applicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { applicationStatus, statusMessage } = req.body;

    if (!id || !mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid business ID" });
    }

    const existingBusiness = await Business.findById(id);

    if (!existingBusiness) {
      return res.status(404).json({ message: "No business found" });
    }

    const eventId = existingBusiness.event;

    if (!eventId || !mongoose.isValidObjectId(eventId)) {
      return res.status(400).json({ message: "Invalid event ID" });
    }

    const event = await Event.findById(eventId);

    if (applicationStatus === "approved") {
      // Move the business ID from participantList to businessList
      event.applicantList = event.applicantList.filter(
        (applicantId) => applicantId.toString() !== id,
      );
      event.businessList.push(id);
    }

    existingBusiness.statusMessage = statusMessage;
    existingBusiness.applicationStatus = applicationStatus;

    await existingBusiness.save();
    await event.save();

    let newEvent = await Event.findById(eventId)
      .populate({
        path: "businessList",
        populate: {
          path: "user",
          model: "user",
        },
      })
      .populate({
        path: "applicantList",
        populate: {
          path: "user",
          model: "user",
        },
      })
      .exec();

    return res.status(200).json({
      message: "Business application status updated successfully",
      business: existingBusiness,
      event: newEvent,
    });
  } catch (err) {
    handleError(res, err);
  }
};

// archive business
const archiveBusiness = async (req, res) => {
  try {
    const { id } = req.params;
    const { isArchived } = req.body;

    if (!id || !mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid business ID" });
    }

    const existingBusiness = await Business.findById(id);

    if (!existingBusiness) {
      return res.status(404).json({ message: "No business found" });
    }

    existingBusiness.isArchived = isArchived;
    await existingBusiness.save();

    const action = isArchived ? "archived" : "unarchived";

    return res.status(200).json({
      message: `Business ${action} successfully`,
      business: existingBusiness,
    });
  } catch (err) {
    handleError(res, err);
  }
};

module.exports = {
  getBusiness,
  getBusinessList,
  addBusiness,
  editBusiness,
  applicationStatus,
  archiveBusiness,
};
