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
      minlength: [3, "Name must be at least 3 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function (v) {
          const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/;
          return emailRegex.test(v);
        },
        message: "Invalid email format",
      },
      unique: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: Number,
      validate: {
        validator: function (v) {
          return /^\d{10}$/.test(v);
        },
        message: "Phone number must be a 10-digit number",
      },
    },
    role: {
      type: String,
      default: "newUser",
      validate: {
        validator: function (v) {
          return [
            "admin",
            "newUser",
            "pendingUser",
            "user",
            "monitor",
            "rejected",
          ].includes(v);
        },
        message: "Role must be admin, newUser, pendingUser, user, or monitor",
      },
    },
    picture: {
      type: String,
    },
    businessName: {
      type: String,
      trim: true,
      minlength: [3, "Business name must be at least 3 characters"],
      maxlength: [50, "Business name cannot exceed 50 characters"],
    },
    document: {
      type: String,
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
      enum: [true, false],
      validate: {
        validator: function (v) {
          return typeof v === "boolean";
        },
        message: "isArchived must be a boolean value",
      },
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("user", UserSchema);
