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
    const notification = new Notification(notificationData);
    await notification.save();
    return notification;
  } catch (error) {
    throw error;
  }
};

const createNotification = async (req, res, next) => {
  try {
    const notification = new Notification(req.body);
    await notification.save();
    res.status(201).json({ notification });
  } catch (error) {
    next(error);
  }
};

const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({
      userId: req.params.userId,
    });
    res.json({ notificationList: notifications });
  } catch (error) {
    next(error);
  }
};

const deleteNotification = async (req, res, next) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ message: "Notification deleted successfully" });
  } catch (error) {
    next(error);
  }
};

const markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true },
    );
    res.json({ notification });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addNotification,
  createNotification,
  getNotifications,
  deleteNotification,
  markAsRead,
};
