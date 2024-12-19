const express = require("express");
const router = express.Router();

const {
  getViolationList,
  getViolation,
  createViolation,
  deleteViolation,
} = require("../controller/violation.cjs");

router.get("/:eventId", getViolationList);
router.get("/:id", getViolation);
router.post("/:eventId", createViolation);
router.delete("/:id", deleteViolation);

module.exports = router;
