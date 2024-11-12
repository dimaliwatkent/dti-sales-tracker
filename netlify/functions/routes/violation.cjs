const express = require("express");
const router = express.Router();

const {
  getViolationList,
  getViolation,
  createViolation,
  updateViolation,
  archiveViolation,
} = require("../controller/violation.cjs");

router.get("/", getViolationList);
router.post("/", createViolation);
router.get("/:id", getViolation);
router.put("/:violationId", updateViolation);
router.patch("/:id", archiveViolation);

module.exports = router;
