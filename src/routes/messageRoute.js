import express from 'express';
import MessageController from '../controllers/messageController.js';

const Router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Messages
 *   description: API tin nhắn
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Message:
 *       type: object
 *       required:
 *         - conversationId
 *         - sender
 *         - content
 *       properties:
 *         conversationId:
 *           type: string
 *           description: ID của cuộc trò chuyện chứa tin nhắn
 *           example: "65d2f3c48bfc3c001fc08b7a"
 *         sender:
 *           type: string
 *           description: ID của người gửi tin nhắn
 *           example: "65d2f3c48bfc3c001fc08b7b"
 *         content:
 *           type: object
 *           description: Nội dung tin nhắn
 *           required:
 *             - contentType
 *           properties:
 *             contentType:
 *               type: string
 *               enum: [img, video, text, record]
 *               description: Loại nội dung của tin nhắn
 *               example: "text"
 *             message:
 *               type: string
 *               description: Nội dung tin nhắn (bắt buộc nếu contentType là "text")
 *               example: "Xin chào!"
 *             mediaUrl:
 *               type: string
 *               description: Đường dẫn media (bắt buộc nếu contentType là "img", "video" hoặc "record")
 *               example: "https://example.com/image.jpg"
 *         seenBy:
 *           type: array
 *           description: Danh sách ID của những người đã xem tin nhắn
 *           items:
 *             type: string
 *           example: ["65d2f3c48bfc3c001fc08b7c", "65d2f3c48bfc3c001fc08b7d"]
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Thời gian tạo tin nhắn
 *           example: "2025-03-08T12:34:56Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Thời gian cập nhật tin nhắn
 *           example: "2025-03-08T12:35:00Z"
 */

/**
 * @swagger
 * /messages:
 *   get:
 *     summary: Lấy danh sách tất cả tin nhắn
 *     tags: [Messages]
 *     responses:
 *       200:
 *         description: Danh sách tin nhắn
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Message'
 */
Router.get('/', MessageController.getMessages);

/**
 * @swagger
 * /messages/{id}:
 *   get:
 *     summary: Lấy một tin nhắn theo ID
 *     tags: [Messages]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của tin nhắn cần lấy
 *     responses:
 *       200:
 *         description: Trả về thông tin tin nhắn
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *       404:
 *         description: Không tìm thấy tin nhắn
 */
Router.get('/:id', MessageController.getMessageById);

/**
 * @swagger
 * /messages:
 *   post:
 *     summary: Gửi tin nhắn mới
 *     tags: [Messages]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Message'
 *     responses:
 *       201:
 *         description: Tin nhắn được tạo thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 */
Router.post('/', MessageController.createMessage);

/**
 * @swagger
 * /messages/{id}:
 *   patch:
 *     summary: Cập nhật tin nhắn theo ID
 *     tags: [Messages]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của tin nhắn cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Message'
 *     responses:
 *       200:
 *         description: Cập nhật tin nhắn thành công
 *       404:
 *         description: Không tìm thấy tin nhắn
 */
Router.patch('/:id', MessageController.updateMessageById);

/**
 * @swagger
 * /messages/{id}:
 *   delete:
 *     summary: Xóa tin nhắn theo ID
 *     tags: [Messages]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của tin nhắn cần xóa
 *     responses:
 *       200:
 *         description: Tin nhắn đã được xóa thành công
 *       404:
 *         description: Không tìm thấy tin nhắn
 */
Router.delete('/:id', MessageController.deleteMessageById);

/**
 * @swagger
 * /messages/of-conversation/{id}:
 *   get:
 *     summary: Lấy tin nhắn của một hộp thoại
 *     tags: [Messages]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của hộp thoại
 *     responses:
 *       200:
 *         description: Lấy dữ liệu thành công
 *       404:
 *         description: Không tìm thấy tin nhắn
 */
Router.get('/of-conversation/:id', MessageController.getMessagesByConversationId);

export const messageRoute = Router;

