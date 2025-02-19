const User = require("../models/user.cjs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const { sendEmail } = require("../utils/sendEmail.cjs");

dotenv.config();

// Get
const getUserList = async (req, res, next) => {
  try {
    const isArchived = req.query.isArchived === "true";
    const userList = await User.find({ isArchived }).populate(
      "businessList",
      "name",
    );

    if (!userList.length) {
      return res.status(404).json({ message: "No users found" });
    }

    return res.status(200).json({
      message: "User list retrieved successfully",
      userList: userList,
    });
  } catch (error) {
    next(error);
  }
};

// getById
const getUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // const user = await User.findById(id).populate("businessList").exec();
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "No user found" });
    }

    return res
      .status(200)
      .json({ message: "User retrieved successfully", user });
  } catch (error) {
    next(error);
  }
};

// Update role
const changeRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!id || !mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const existingUser = await User.findById(id);

    if (!existingUser) {
      return res.status(404).json({ message: "No user found" });
    }

    existingUser.role = role;

    if (role === "rejected") {
      await sendEmail(
        existingUser.email,
        "<h1>Registration Rejected</h1>",
        `<p>Hello ${existingUser.name},</h1><p>We regret to inform you that your registration has been rejected.</p>
        <br/>
        <p>Sincerely,</p>
        <p>DTI - Marinduque</p>`,
      );
    } else if (role === "user") {
      await sendEmail(
        existingUser.email,
        "<h1>Registration Approved</h1>",
        `<p>Good day Exhibitor,</p>
        <p>       Your account registration for Trade Fair Management System Marinduque has been <strong>APPROVED</strong>. Your role is now updated. You may see event that are open for application for you to apply. Thank you.</p>
        <br/>
        <p>Sincerely,</p>
        <p>DTI - Marinduque</p>`,
      );
    } else {
      await sendEmail(
        existingUser.email,
        "<h1>Registration Approved</h1>",
        `<p>Good day Exhibitor,</p>
        <p>       Your account registration for Trade Fair Management System Marinduque has been <strong>APPROVED</strong>. Your role is now updated into ${role}. Thank you.</p>
        <br/>
        <p>Sincerely,</p>
        <p>DTI - Marinduque</p>`,
      );
    }

    await existingUser.save();

    return res.status(200).json({
      message: "User's role updated successfully",
      user: existingUser,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserList,
  getUser,
  changeRole,
};
