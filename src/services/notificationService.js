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
    const { senderId, receiverId, relatedEntityType, message } = data;

    let findQuery = {
      senderId: senderId,
      receiverId: receiverId,
      relatedEntityType: relatedEntityType,
      _destroy: null, // Chỉ tìm thông báo chưa bị xóa mềm
    };

    switch (relatedEntityType) {
      case 'Group':
        findQuery.groupId = data.groupId;
        break;
      case 'Article':
        findQuery.articleId = data.articleId;
        break;
      case 'Comment':
        findQuery.articleId = data.articleId; // Cần context bài viết
        findQuery.commentId = data.commentId; // ID bình luận cụ thể
        break;
      case 'Page':
        findQuery.pageId = data.pageId;
        break;
      case 'Reel':
        findQuery.reelId = data.reelId;
        if (data.commentId) {
            findQuery.commentId = data.commentId; // ID bình luận trên Reel
        }
        break;
      case 'User':
        // senderId đủ để định danh hành động User-to-User
        break;
      default:
        findQuery.message = message; // Dùng tin nhắn cho thông báo chung chung
        break;
    }

    let existingNotification = await Notification.findOne(findQuery);

    if (existingNotification) {
      console.log('Đã tìm thấy thông báo hiện có, đang cập nhật:', existingNotification._id);

      // Cập nhật trạng thái và thời gian để làm mới thông báo
      if (existingNotification.status === 'read') {
        existingNotification.status = 'unread';
        existingNotification.readAt = null;
      }
      if (existingNotification.message !== data.message) {
          existingNotification.message = data.message;
      }
      existingNotification.createdAt = Date.now();

      await existingNotification.save();

      // Phát sự kiện cập nhật cho frontend
      emitEvent("user", data.receiverId, "updatedNotification", {
        notification: existingNotification,
      });

      return existingNotification;

    } else {
      // Tạo thông báo mới nếu không tìm thấy bản trùng lặp
      const newNotification = await Notification.create(data);
      console.log('Đã tạo thông báo mới:', newNotification._id);

      // Phát sự kiện thông báo mới cho frontend
      emitEvent("user", data.receiverId, "newNotification", {
        notification: newNotification,
      });

      return newNotification;
    }
  } catch (error) {
    console.error("Lỗi trong createNotification:", error);
    throw error;
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
