const express = require("express");
const router = express.Router();

const {
  getBusinessList,
  getBusiness,
  addBusiness,
  editBusiness,
  archiveBusiness,
  applicationStatus,
} = require("../controller/business.cjs");

router.get("/", getBusinessList);
router.post("/", addBusiness);
router.get("/:id", getBusiness);
router.put("/:id", editBusiness);
router.patch("/:id", archiveBusiness);
router.patch("/status/:id", applicationStatus);

module.exports = router;
