const express = require("express");
const router = express.Router();

const {
  getBusinessAwardList,
  getBusinessAward,
  createBusinessAward,
  updateBusinessAward,
  archiveBusinessAward,
} = require("../controller/businessAward.cjs");

router.get("/:id", getBusinessAwardList);
router.get("/:businessId", getBusinessAward);
router.post("/:id", createBusinessAward);
router.patch("/:id", archiveBusinessAward);
router.post("/:businessAwardId", updateBusinessAward);

module.exports = router;
