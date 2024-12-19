const express = require("express");
const router = express.Router();

const { getUserList, getUser, changeRole } = require("../controller/user.cjs");

router.get("/", getUserList);
router.get("/:id", getUser);
router.patch("/:id/role", changeRole);

module.exports = router;
