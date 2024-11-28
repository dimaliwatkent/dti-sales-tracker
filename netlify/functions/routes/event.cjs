const express = require("express");
const router = express.Router();

const {
  getEventList,
  getUserEventList,
  getMonitorEventList,
  getEvent,
  addEvent,
  editEvent,
  archiveEvent,
} = require("../controller/event.cjs");

router.get("/", getEventList);
router.get("/user/:userId", getUserEventList);
router.get("/monitor", getMonitorEventList);
router.get("/:id", getEvent);
router.post("/", addEvent);
router.put("/:id", editEvent);
router.patch("/:id", archiveEvent);

module.exports = router;
