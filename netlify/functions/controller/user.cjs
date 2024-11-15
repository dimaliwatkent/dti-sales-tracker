const User = require("../models/user.cjs");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

// handle error
const handleError = (res, err) => {
  return res
    .status(500)
    .json({ message: "An error occurred", err: err.message });
};

// Get
const getUserList = async (req, res) => {
  try {
    const isArchived = req.query.isArchived === "true";
    const user = await User.find({ isArchived }).populate(
      "businessList",
      "name",
    );

    if (!user.length) {
      return res.status(404).json({ message: "No user found" });
    }

    return res
      .status(200)
      .json({ message: "User list retrieved successfully", user });
  } catch (err) {
    handleError(res, err);
  }
};

// getById
const getUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // const user = await User.findById(id).populate("businessList").exec();
    const user = await User.findById(id).populate("businessList").exec();

    if (!user) {
      return res.status(404).json({ message: "No user found" });
    }

    return res
      .status(200)
      .json({ message: "User retrieved successfully", user });
  } catch (err) {
    handleError(res, err);
  }
};

// Update
const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, email, password, phoneNumber, role } = req.body;

    if (!userId || !mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const existingUser = await User.findById(userId);

    if (!existingUser) {
      return res.status(404).json({ message: "No user found" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    existingUser.name = name;
    existingUser.email = email;
    existingUser.password = hashedPassword;
    existingUser.phoneNumber = phoneNumber;
    existingUser.role = role;
    await existingUser.save();

    return res
      .status(200)
      .json({ message: "User updated successfully", user: existingUser });
  } catch (err) {
    handleError(res, err);
  }
};

// Update
const changeRole = async (req, res) => {
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
    await existingUser.save();

    return res.status(200).json({
      message: "User's role updated successfully",
      user: existingUser,
    });
  } catch (err) {
    handleError(res, err);
  }
};

// Archive
const archiveUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { isArchived } = req.body;

    if (!id || !mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const existingUser = await User.findById(id);

    if (!existingUser) {
      return res.status(404).json({ message: "No user found" });
    }

    existingUser.isArchived = isArchived;
    await existingUser.save();

    const action = isArchived ? "archived" : "unarchived";

    return res
      .status(200)
      .json({ message: `User ${action} successfully`, user: existingUser });
  } catch (err) {
    handleError(res, err);
  }
};

module.exports = {
  getUserList,
  getUser,
  updateUser,
  changeRole,
  archiveUser,
};
