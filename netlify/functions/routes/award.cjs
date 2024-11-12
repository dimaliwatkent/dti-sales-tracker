const express = require("express");
const router = express.Router();

const {
  getAwardList,
  getAward,
  createAward,
  updateAward,
  archiveAward,
} = require("../controller/award.cjs");

router.get("/", getAwardList);
router.post("/", createAward);
router.get("/:id", getAward);
router.patch("/:id", archiveAward);
router.put("/:id", updateAward);

module.exports = router;
