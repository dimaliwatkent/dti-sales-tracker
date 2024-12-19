const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    businessList: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "business",
      },
    ],
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: Number,
    },
    // "admin", "newUser", "pendingUser", "user", "monitor", "rejected"
    role: {
      type: String,
      default: "newUser",
    },
    picture: {
      type: String,
    },
    businessName: {
      type: String,
      trim: true,
    },
    document: {
      type: String,
    },
    dtiRegistrationNumber: {
      type: Number,
    },
    refreshToken: {
      type: String,
    },
    resetPin: {
      type: String,
    },
    resetPinExpiration: {
      type: Date,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("user", UserSchema);
