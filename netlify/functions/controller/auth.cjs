const User = require("../models/user.cjs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const { sendEmail } = require("../utils/sendEmail.cjs");

const {
  uploadToS3,
  bucketName,
  bucketRegion,
} = require("../utils/s3Client.cjs");

const {
  signUpSchema,
  signInSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} = require("../zod/authSchema.cjs");

const {
  generateAccessToken,
  generateRefreshToken,
} = require("../middleware/auth.cjs");

const crypto = require("node:crypto");

const dotenv = require("dotenv");

dotenv.config();

// get user info
function getUserInfo(user) {
  return {
    _id: user._id,
    businessList: user.businessList,
    name: user.name,
    email: user.email,
    phoneNumber: user.phoneNumber,
    role: user.role,
    picture: user.picture,
    businessName: user.businessName,
    isArchived: user.isArchived,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    refreshToken: user.refreshToken,
  };
}

// Sign Up
const signUp = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      phoneNumber,
      businessName,
      document,
      dtiRegistrationNumber,
    } = req.body;

    const parsedBody = signUpSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return res.status(422).json({
        message: "Invalid request body",
        errors: parsedBody.error.issues,
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(422).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
      businessName,
      businessList: null,
      dtiRegistrationNumber,
    });

    const accessToken = await generateAccessToken({ id: newUser._id });
    const refreshToken = await generateRefreshToken({
      id: newUser._id,
      email: newUser.email,
    });
    newUser.refreshToken = refreshToken;

    // Decode the base64 string
    const binaryFile = Buffer.from(document.split(",")[1], "base64");
    const fileType = document.split(";")[0].split(":")[1];
    const fileExtension = fileType.split("/")[1];
    const fileName = `registrations/${newUser.name}/${newUser.name}-${newUser._id}.${fileExtension}`;

    const params = {
      Bucket: bucketName,
      Key: fileName,
      Body: binaryFile,
      ContentType: fileType,
    };

    try {
      await uploadToS3(params);
    } catch (error) {
      return res.status(500).json({
        message: "Failed to upload document",
        error: error.name,
      });
    }

    const docUrl = `https://${bucketName}.s3.${bucketRegion}.amazonaws.com/${fileName}`;
    newUser.document = docUrl;

    await newUser.save();

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    return res.status(201).json({
      message: "Sign up successful",
      user: getUserInfo(newUser),
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

// Sign In
const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const parsedBody = signInSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return res.status(422).json({
        message: "Invalid request body",
        errors: parsedBody.error.issues,
      });
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(422).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password,
    );
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const accessToken = await generateAccessToken({ id: existingUser._id });
    const refreshToken = await generateRefreshToken({
      id: existingUser._id,
      email: existingUser.email,
    });

    existingUser.refreshToken = refreshToken;
    await existingUser.save();

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    return res.status(200).json({
      message: "Sign in successful",
      user: getUserInfo(existingUser),
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

// Login with Refresh Token
const loginWithRefreshToken = async (req, res, next) => {
  try {
    // const refreshToken = req.cookies.refreshToken // Uncomment this line to use cookies
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token required" });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const accessToken = await generateAccessToken({ user: user._id });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    return res
      .status(200)
      .json({ message: "Logged in successful", accessToken });
  } catch (error) {
    next(error);
  }
};

// Sign Out
const signOut = async (req, res, next) => {
  try {
    const { id } = req.body;

    if (!id || !mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    const user = await User.findById(id);
    if (user) {
      user.refreshToken = null;
      await user.save();
    } else {
      return res.status(403).json({ message: "Forbidden" });
    }

    return res.status(200).json({ message: "Signed out successfully" });
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const parsedBody = forgotPasswordSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return res.status(422).json({
        message: "Invalid request body",
        errors: parsedBody.error.issues,
      });
    }

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User with this email does not exist" });
    }

    const pin = crypto.randomBytes(6).toString("hex").slice(0, 6);

    const hashedPin = await bcrypt.hash(pin, 10);

    const pinExpiration = new Date(Date.now() + 10 * 60 * 1000); // PIN expires in 10 minutes

    user.resetPin = hashedPin;
    user.resetPinExpiration = pinExpiration;
    await user.save();

    await sendEmail(
      email,
      "Password Reset Request",
      `<p>Hello ${user.name},</p>
       <p>We received a request to reset your password.</p>
       <p>Here is your pin code ${pin}</p>
       <p>This code will expire in 10 minutes.</p>`,
    );

    return res.status(200).json({ message: `Reset link is sent to ${email}` });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { email, pin, password } = req.body;

    const parsedBody = resetPasswordSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return res.status(422).json({
        message: "Invalid request body",
        errors: parsedBody.error.issues,
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashedPin = user.resetPin;
    const isValidPin = await bcrypt.compare(pin, hashedPin);

    if (!isValidPin) {
      return res.status(400).json({ message: "Invalid or incorrect PIN" });
    }

    if (new Date() > user.resetPinExpiration) {
      return res.status(400).json({ message: "PIN has expired" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.resetPin = null;
    user.resetPinExpiration = null;
    await user.save();

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signUp,
  signIn,
  loginWithRefreshToken,
  signOut,
  forgotPassword,
  resetPassword,
};
