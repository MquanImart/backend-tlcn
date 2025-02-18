import { notificationService } from "../services/notificationService.js";

const getNotifications = async (req, res) => {
  try {
    const { receiverId, status } = req.query;
    
    if (!receiverId) {
      return res.status(400).json({ success: false, data: null, message: "receiverId là bắt buộc" });
    }

    console.log(`🔍 API Call: /notifications?receiverId=${receiverId}&status=${status}`);
    
    const result = await notificationService.getNotificationsByStatus(receiverId, status);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

const getNotificationById = async (req, res) => {
  try {
    const notification = await notificationService.getNotificationById(req.params.id);
    if (!notification) return res.status(404).json({ success: false, data: null, message: 'Thông báo không tồn tại' });
    res.status(200).json({ success: true, data: notification, message: 'Lấy thông báo thành công' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

const createNotification = async (req, res) => {
  try {
    const newNotification = await notificationService.createNotification(req.body);
    res.status(201).json({ success: true, data: newNotification, message: 'Tạo thông báo thành công' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

const updateNotificationById = async (req, res) => {
  try {
    const updatedNotification = await notificationService.updateNotificationById(req.params.id, req.body);
    if (!updatedNotification) return res.status(404).json({ success: false, data: null, message: 'Thông báo không tồn tại' });
    res.status(200).json({ success: true, data: updatedNotification, message: 'Cập nhật thông báo thành công' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

const updateAllNotifications = async (req, res) => {
  try {
    const updatedNotifications = await notificationService.updateAllNotifications(req.body);
    res.status(200).json({ success: true, data: updatedNotifications, message: 'Cập nhật tất cả thông báo thành công' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

const deleteNotificationById = async (req, res) => {
  try {
    const deletedNotification = await notificationService.deleteNotificationById(req.params.id);
    if (!deletedNotification) return res.status(404).json({ success: false, data: null, message: 'Thông báo không tồn tại' });
    res.status(200).json({ success: true, data: null, message: 'Xóa thông báo thành công' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

export const notificationController = {
  getNotifications,
  getNotificationById,
  createNotification,
  updateNotificationById,
  updateAllNotifications,
  deleteNotificationById,
};
