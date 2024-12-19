const express = require("express");
const router = express.Router();

const {
  getBusinessListViolation,
  addBusinessViolation,
  getBusinessViolationList,
  markAsPaid,
} = require("../controller/businessViolation.cjs");

router.get("/:eventId", getBusinessListViolation);

router.post("/add-violation/:businessId", addBusinessViolation);
router.get("/business/:businessId", getBusinessViolationList);
router.patch("/mark-paid/:businessId", markAsPaid);

module.exports = router;
