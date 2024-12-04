const Notification = require("../models/notification.cjs");

// {
//   "userId": "62d8a4c6a3f3a5b3a8a8a8a8",
//   "title": "New notification",
//   "message": "This is a new notification",
//   "type": "info",
//   "severity": "medium"
// }

const addNotification = async (notificationData) => {
  try {
    console.log("during");
    const notification = new Notification(notificationData);
    await notification.save();
    return notification;
  } catch (error) {
    throw error;
  }
};

const createNotification = async (req, res) => {
  try {
    const notification = new Notification(req.body);
    await notification.save();
    res.status(201).json({ notification });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      userId: req.params.userId,
    });
    res.json({ notificationList: notifications });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const updateNotification = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    res.json({ notification });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const deleteNotification = async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ message: "Notification deleted successfully" });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true },
    );
    res.json({ notification });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports = {
  addNotification,
  createNotification,
  getNotifications,
  updateNotification,
  deleteNotification,
  markAsRead,
};
