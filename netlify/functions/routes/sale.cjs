const express = require("express");
const router = express.Router();

const {
  getEventSale,
  getSale,
  getRecordData,
  generateDailySale,
  updateSale,
} = require("../controller/sale.cjs");

router.get("/event/:eventId", getEventSale);
router.get("/:id", getSale);
router.get("/generate/:userId", generateDailySale);
router.get("/record/event", getRecordData);
router.patch("/:id", updateSale);

module.exports = router;
