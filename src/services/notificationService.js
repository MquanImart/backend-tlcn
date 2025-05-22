import Notification from "../models/Notification.js";
import { emitEvent } from "../socket/socket.js";

const getNotifications = async () => {
  return await Notification.find({ _destroy: null })
};

const getNotificationsByStatus = async (receiverId, status, page = 1, limit = 10) => {
  let filter = { receiverId, _destroy: null };

  if (status === "unread") {
    filter.status = "unread";
  } else if (status === "read") {
    filter.status = "read";
  }

  try {
    const skip = (page - 1) * limit;

    const [notifications, total] = await Promise.all([
      Notification.find(filter)
        .populate({
          path: "senderId",
          select: "displayName hashtag avt",
          populate: {
            path: "avt",
            select: "url name",
          },
        })
        .populate({
          path: "receiverId",
          select: "displayName hashtag avt",
          populate: {
            path: "avt",
            select: "url name",
          },
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Notification.countDocuments(filter),
    ]);

    return {
      success: true,
      data: notifications,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      message: "Lấy danh sách thông báo thành công",
    };
  } catch (error) {
    return { success: false, data: null, message: error.message };
  }
};


const getNotificationById = async (id) => {
  return await Notification.findOne({ _id: id, _destroy: null })
};

const createNotification = async (data) => {
  try {
    const newNotification = await Notification.create(data);

    emitEvent("user", data.receiverId, "newNotification", {
      notification: newNotification,
    });

    return newNotification;
  } catch (error) {
    console.error("Error in createNotification:", error);
    throw error; // Or handle gracefully
  }
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
