const User = require("../models/user.cjs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../middleware/auth.cjs");

// handle error
const handleError = (res, err) => {
  return res
    .status(500)
    .cjson({ message: "Internal server error", err: err.message });
};

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
    isArchived: user.isArchived,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    refreshToken: user.refreshToken,
  };
}

// Sign Up
const signUp = async (req, res, next) => {
  try {
    const { name, email, password, phoneNumber } = req.body;

    if (!name || !email || !password) {
      return res.status(400).cjson({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(422).cjson({ message: "Email already exists" });
    }

    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*.])(?=.{8,})/;
    if (!passwordRegex.test(password)) {
      return res.status(400).cjson({
        message:
          "Password must be at least 8 characters long, contain at least one number, and one special character.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
      business: null,
    });

    await newUser.save();

    const accessToken = await generateAccessToken({ id: newUser._id });
    const refreshToken = await generateRefreshToken({
      id: newUser._id,
      email: newUser.email,
    });

    newUser.refreshToken = refreshToken;
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

    return res.status(201).cjson({
      message: "Sign up successful",
      user: getUserInfo(newUser),
      accessToken,
    });
  } catch (err) {
    handleError(res, err);
  }
};

// Sign In
const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(422).cjson({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password,
    );
    if (!isPasswordValid) {
      return res.status(401).cjson({ message: "Invalid email or password" });
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

    return res.status(200).cjson({
      message: "Sign in successful",
      user: getUserInfo(existingUser),
      accessToken,
    });
  } catch (err) {
    handleError(res, err);
  }
};

// Login with Refresh Token
const loginWithRefreshToken = async (req, res) => {
  try {
    // const refreshToken = req.cookies.refreshToken // Uncomment this line to use cookies
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).cjson({ message: "Refresh token required" });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).cjson({ message: "Invalid refresh token" });
    }

    const accessToken = await generateAccessToken({ user: user._id });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    return res
      .status(200)
      .cjson({ message: "Logged in successful", accessToken });
  } catch (err) {
    handleError(res, err);
  }
};

// Sign Out
const signOut = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id || !mongoose.isValidObjectId(id)) {
      return res.status(400).cjson({ message: "Invalid user ID" });
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
      return res.status(403).cjson({ message: "Forbidden" });
    }

    return res.status(200).cjson({ message: "Signed out successfully" });
  } catch (err) {
    handleError(res, err);
  }
};

module.exports = {
  signUp,
  signIn,
  loginWithRefreshToken,
  signOut,
};
