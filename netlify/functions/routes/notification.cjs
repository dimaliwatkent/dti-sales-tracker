const express = require("express");
const router = express.Router();

const {
  createNotification,
  getNotifications,
  deleteNotification,
  markAsRead,
} = require("../controller/notification.cjs");

router.post("/", createNotification);
router.get("/:userId", getNotifications);
router.delete("/:id", deleteNotification);
router.patch("/mark-as-read/:id", markAsRead);

module.exports = router;
module.exports = router;
