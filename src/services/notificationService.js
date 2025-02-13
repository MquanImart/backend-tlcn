import Notification from "../models/Notification.js";

const getNotifications = async () => {
  return await Notification.find({ _destroy: null })
};

const getNotificationById = async (id) => {
  return await Notification.findOne({ _id: id, _destroy: null })
};

const createNotification = async (data) => {
  return await Notification.create(data);
};

const updateNotificationById = async (id, data) => {
  return await Notification.findByIdAndUpdate(id, data, { new: true })
};

const updateAllNotifications = async (data) => {
  return await Notification.updateMany({}, data, { new: true });
};

const deleteNotificationById = async (id) => {
  return await Notification.findByIdAndUpdate(id, { _destroy: Date.now() }, { new: true });
};

export const notificationService = {
  getNotifications,
  getNotificationById,
  createNotification,
  updateNotificationById,
  updateAllNotifications,
  deleteNotificationById,
};
