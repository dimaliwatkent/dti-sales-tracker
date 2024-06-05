const express = require("express");
const { signin, signup, signout } = require("../controller/auth.cjs");

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/signout", signout);

module.exports = router;
