const express = require("express");
const router = express.Router();

const {
  getEventSale,
  getAllEventSales,
  getSale,
  getRecordData,
  generateDailySale,
  updateSale,
  archiveSale,
} = require("../controller/sale.cjs");

router.get("/event/:eventId", getEventSale);
router.get("/event/all/:eventId", getAllEventSales);
router.get("/:id", getSale);
router.get("/generate/:userId", generateDailySale);
router.get("/record/event", getRecordData);
router.patch("/:id", updateSale);
router.patch("/archive/:id", archiveSale);

module.exports = router;
