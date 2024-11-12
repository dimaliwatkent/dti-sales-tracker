const express = require("express");
const {
  signUp,
  signIn,
  loginWithRefreshToken,
  signOut,
} = require("../controller/auth.cjs");

const router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/signout", signOut);
router.post("/refresh", loginWithRefreshToken);

module.exports = router;
