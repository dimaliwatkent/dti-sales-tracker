const express = require("express");
const router = express.Router();

const {
  getEventByStatus,
  getEventWithBusiness,
  getEventList,
  getUserEventList,
  getEventPopulated,
  getEvent,
  addEvent,
  editEvent,
  archiveEvent,
} = require("../controller/event.cjs");

router.get("/status/:status", getEventByStatus);
router.get("/business/:id", getEventWithBusiness);
router.get("/", getEventList);

router.get("/user/:userId", getUserEventList);
router.get("/populated/:id", getEventPopulated);
router.get("/:id", getEvent);
router.post("/", addEvent);
router.put("/:id", editEvent);
router.patch("/:id", archiveEvent);

module.exports = router;
