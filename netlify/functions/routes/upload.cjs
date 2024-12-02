const express = require("express");
const router = express.Router();

const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

const { uploadProfile, deleteProfile } = require("../controller/upload.cjs");

router.post("/profile", upload.single("image"), uploadProfile);
router.delete("/profile/:userId", deleteProfile);

module.exports = router;
