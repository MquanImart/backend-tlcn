import Notification from "../models/Notification.js";

const getNotifications = async () => {
  return await Notification.find({ _destroy: null })
};

const getNotificationsByStatus = async (receiverId, status) => {
  let filter = { receiverId, _destroy: null };

  if (status === "unread") {
    filter.status = "unread";
  } else if (status === "read") {
    filter.status = "read";
  }

  try {
    console.log("🔎 Querying Notifications with Filter:", filter);
    const notifications = await Notification.find(filter).sort({ createdAt: -1 });
    console.log("✅ MongoDB Query Result:", notifications);
    return { success: true, data: notifications, message: "Lấy danh sách thông báo thành công" };
  } catch (error) {
    return { success: false, data: null, message: error.message };
  }
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
  getNotificationsByStatus
};
