const express = require("express");
const router = express.Router();

const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

const {
  getBusinessList,
  getBusiness,
  addBusiness,
  editBusiness,
  archiveBusiness,
  applicationStatus,
} = require("../controller/business.cjs");

router.get("/", getBusinessList);
router.post("/", upload.single("logoFile"), addBusiness);
router.get("/:id", getBusiness);
router.put("/:id", editBusiness);
router.patch("/:id", archiveBusiness);
router.patch("/status/:id", applicationStatus);

module.exports = router;
