const express = require("express");
const {
  signUp,
  signIn,
  loginWithRefreshToken,
  signOut,
  forgotPassword,
  resetPassword,
} = require("../controller/auth.cjs");

const router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/signout", signOut);
router.post("/refresh", loginWithRefreshToken);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;
