const express = require("express");
const router = express.Router();

const {
  getBusinessViolationList,
  getBusinessViolation,
  createBusinessViolation,
  payBusinessViolation,
  addBusinessViolation,
} = require("../controller/businessViolation.cjs");

router.post("/add-violation/:businessId", addBusinessViolation);
router.get("/:id", getBusinessViolationList);
router.get("/:businessViolation", getBusinessViolation);
router.put("/:id", payBusinessViolation);
router.post("/:businessId", createBusinessViolation);

module.exports = router;
