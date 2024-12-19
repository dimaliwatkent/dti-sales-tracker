const express = require("express");
const router = express.Router();

const {
  getBusinessList,
  getBusiness,
  addBusiness,
  editBusiness,
  applicationStatus,
  getBusinessProductList,
} = require("../controller/business.cjs");

router.get("/", getBusinessList);
router.get("/:id", getBusiness);
router.post("/", addBusiness);
router.put("/:id", editBusiness);
router.patch("/status/:id", applicationStatus);
router.get("/product/:id", getBusinessProductList);

module.exports = router;
