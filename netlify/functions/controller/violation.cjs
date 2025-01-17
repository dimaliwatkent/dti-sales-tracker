const Violation = require("../models/violation.cjs");
const mongoose = require("mongoose");

const defaultViolationList = [
  {
    name: "Late Ingress",
    fee: 1000,
    description: "",
  },
  {
    name: "Back-out",
    fee: 1000,
    description: "1-year suspension from Marinduque Trade Fair plus fine",
  },
  {
    name: "Tardiness",
    fee: 100,
    description: "Non-observance of exhibitor hours",
  },
  {
    name: "After 12:00 NN",
    fee: 500,
    description: "Non-observance of exhibitor hours",
  },
  {
    name: "Early Departure/Undertime",
    fee: 100,
    description: "Non-observance of exhibitor hours",
  },
  {
    name: "Unmanned Booth: 1st Offense",
    fee: 500,
    description: "",
  },
  {
    name: "Unmanned Booth: 2nd Offense",
    fee: 1000,
    description: "",
  },
  {
    name: "Closed booth without permission: 1st Offense",
    fee: 500,
    description: "",
  },
  {
    name: "Closed booth without permission: 2nd Offense",
    fee: 1000,
    description: "",
  },
  {
    name: "Non-compliance with dress code",
    fee: 500,
    description: "",
  },
  {
    name: "Early Serving of Alcohol",
    fee: 500,
    description: "",
  },
  {
    name: "Selling Other Products",
    fee: 1000,
    description:
      "Selling products other than those declared in the application by the exhibitor and Selling not a Marinduque product (1-year suspension from Marinduque Trade Fair plus fine)",
  },
  {
    name: "Early Egress",
    fee: 1000,
    description: "1-year suspension from Marinduque Trade Fair plus fine",
  },
  {
    name: "Nonpayment: Electricity Fee",
    fee: 5000,
    description: "",
  },
  {
    name: "Nonpayment: Municipality of Boac",
    fee: 5000,
    description: "",
  },
  {
    name: "Dirty Area",
    fee: 500,
    description: "Dirty dining, back, and sink-no mesh",
  },
  {
    name: "Using Plastic or Styrofoam",
    fee: 500,
    description: "",
  },
  {
    name: "Behaviour-related or Other Admin Concerns",
    fee: 1000,
    description: "",
  },
  {
    name: "Non-observance of Minimum Health Protocol",
    fee: 500,
    description: "",
  },
  {
    name: "Sales Submission",
    fee: 500,
    description: "",
  },
];
// get all violations
const getViolationList = async (req, res, next) => {
  try {
    const { eventId } = req.params;

    // Find all violations for the event
    const violationList = await Violation.find({ eventId });

    if (!violationList.length) {
      const savedViolations = await Promise.all(
        defaultViolationList.map((violation) => {
          const newViolation = new Violation({
            ...violation,
            eventId: eventId,
          });
          return newViolation.save();
        }),
      );

      return res.status(200).json({
        message: "Violations retrieved successfully",
        violationList: savedViolations,
      });
    }

    return res
      .status(200)
      .json({ message: "Violations retrieved successfully", violationList });
  } catch (error) {
    next(error);
  }
};

// get violation by id
const getViolation = async (req, res, next) => {
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
  } catch (error) {
    next(error);
  }
};

// create violation
const createViolation = async (req, res, next) => {
  try {
    const { name, fee, description } = req.body;
    const { eventId } = req.params;

    const existingViolation = await Violation.findOne({ name });

    if (existingViolation) {
      return res.status(409).json({ message: "Violation already exists" });
    }

    const newViolation = new Violation({
      name,
      fee,
      description,
      eventId: eventId,
    });

    await newViolation.save();

    return res.status(201).json({
      message: "Violation created successfully",
      violation: newViolation,
    });
  } catch (error) {
    next(error);
  }
};
const deleteViolation = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid violation ID" });
    }

    const violation = await Violation.findByIdAndDelete(id);

    if (!violation) {
      return res.status(404).json({ message: "No violation found" });
    }

    return res.status(200).json({ message: "Violation deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getViolationList,
  getViolation,
  createViolation,
  deleteViolation,
};
