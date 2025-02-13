import express from 'express';
import { notificationController } from '../controllers/notificationController.js';

const Router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Notifications
 */

/**
 * @swagger
 * /notifications:
 *   get:
 *     summary: Lấy danh sách thông báo
 *     tags: [Notifications]
 *     responses:
 *       200:
 *         description: Trả về danh sách thông báo
 */
Router.get('/', notificationController.getNotifications);

/**
 * @swagger
 * /notifications/{id}:
 *   get:
 *     summary: Lấy thông báo theo ID
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của thông báo cần lấy
 *     responses:
 *       200:
 *         description: Trả về thông báo
 */
Router.get('/:id', notificationController.getNotificationById);

/**
 * @swagger
 * /notifications:
 *   post:
 *     summary: Tạo thông báo mới
 *     tags: [Notifications]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               senderId:
 *                 type: string
 *                 example: "60f7ebeb2f8fb814b56fa181"
 *               receiverId:
 *                 type: string
 *                 example: "60f7ebeb2f8fb814b56fa182"
 *               message:
 *                 type: string
 *                 example: "Chào bạn!"
 *               status:
 *                 type: string
 *                 enum: ['read', 'unread']
 *                 example: "unread"
 *     responses:
 *       201:
 *         description: Tạo thông báo thành công
 */
Router.post('/', notificationController.createNotification);

/**
 * @swagger
 * /notifications/{id}:
 *   patch:
 *     summary: Cập nhật thông báo theo ID
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của thông báo cần cập nhật
 *     responses:
 *       200:
 *         description: Cập nhật thông báo thành công
 */
Router.patch('/:id', notificationController.updateNotificationById);

/**
 * @swagger
 * /notifications:
 *   patch:
 *     summary: Cập nhật tất cả thông báo
 *     tags: [Notifications]
 *     responses:
 *       200:
 *         description: Cập nhật tất cả thông báo thành công
 */
Router.patch('/', notificationController.updateAllNotifications);

/**
 * @swagger
 * /notifications/{id}:
 *   delete:
 *     summary: Xóa thông báo theo ID
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của thông báo cần xóa
 *     responses:
 *       200:
 *         description: Xóa thông báo thành công
 */
Router.delete('/:id', notificationController.deleteNotificationById);

export const notificationRoute = Router;
