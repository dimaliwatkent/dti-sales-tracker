const express = require("express");
const {
  signUp,
  signIn,
  loginWithRefreshToken,
  signOut,
  forgotPassword,
  validateResetPinAndUpdatePassword,
} = require("../controller/auth.cjs");

const router = express.Router();

const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

router.post("/signup", upload.single("document"), signUp);
router.post("/signin", signIn);
router.post("/signout", signOut);
router.post("/refresh", loginWithRefreshToken);
router.post("/forgot-password", forgotPassword);
router.post("/validate-reset-pin", validateResetPinAndUpdatePassword);

module.exports = router;
