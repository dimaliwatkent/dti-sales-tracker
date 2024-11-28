const express = require("express");
const router = express.Router();

const {
  createNotification,
  getNotifications,
  updateNotification,
  deleteNotification,
  markAsRead,
} = require("../controller/notification.cjs");

router.post("/", createNotification);
router.get("/:userId", getNotifications);
router.put("/:id", updateNotification);
router.delete("/:id", deleteNotification);
router.put("/mark-as-read/:id", markAsRead);

module.exports = router;
module.exports = router;
