const Notification = require("../models/notification.cjs");

const createNotification = async (req, res) => {
  try {
    const notification = new Notification(req.body);
    await notification.save();
    res.status(201).cjson({ notification });
  } catch (error) {
    res.status(400).cjson({ message: error.message });
  }
};

const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      userId: req.params.userId,
    });
    res.cjson({ notification: notifications });
  } catch (error) {
    res.status(404).cjson({ message: error.message });
  }
};

const updateNotification = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    res.cjson({ notification });
  } catch (error) {
    res.status(404).cjson({ message: error.message });
  }
};

const deleteNotification = async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.cjson({ message: "Notification deleted successfully" });
  } catch (error) {
    res.status(404).cjson({ message: error.message });
  }
};

const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true },
    );
    res.cjson({ notification });
  } catch (error) {
    res.status(404).cjson({ message: error.message });
  }
};

module.exports = {
  createNotification,
  getNotifications,
  updateNotification,
  deleteNotification,
  markAsRead,
};
