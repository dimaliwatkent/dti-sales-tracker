const express = require("express");
const router = express.Router();

const {
  getUserList,
  getUser,
  updateUser,
  changeRole,
  archiveUser,
} = require("../controller/user.cjs");

router.get("/", getUserList);
router.get("/:id", getUser);
router.put("/:userId", updateUser);
router.patch("/:id/role", changeRole);
router.patch("/:id", archiveUser);

module.exports = router;
