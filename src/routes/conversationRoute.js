import express from 'express';
import ConversationController from '../controllers/conversationController.js';

const Router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Conversations
 *   description: API quản lý cuộc trò chuyện
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Conversation:
 *       type: object
 *       required:
 *         - type
 *         - _user
 *         - content
 *       properties:
 *         type:
 *           type: string
 *           enum: [friend, group, page]
 *           description: Loại cuộc trò chuyện (Bạn bè, Nhóm, Trang)
 *           example: "friend"
 *         _user:
 *           type: array
 *           description: Danh sách người tham gia cuộc trò chuyện
 *           items:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [user, page]
 *                 description: Loại người tham gia (Người dùng hoặc Trang)
 *                 example: "user"
 *               _id:
 *                 type: string
 *                 description: ID của người tham gia
 *                 example: "user123"
 *         content:
 *           type: array
 *           description: Lịch sử tin nhắn trong cuộc trò chuyện
 *           items:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID của người gửi tin nhắn
 *                 example: "user456"
 *               message:
 *                 type: string
 *                 description: Nội dung tin nhắn
 *                 example: "Xin chào, bạn khỏe không?"
 *               sendDate:
 *                 type: number
 *                 description: Thời gian gửi tin nhắn (timestamp)
 *                 example: 1708411234567
 */

/**
 * @swagger
 * /conversations:
 *   get:
 *     summary: Lấy danh sách tất cả cuộc trò chuyện
 *     tags: [Conversations]
 *     responses:
 *       200:
 *         description: Danh sách cuộc trò chuyện
 */
Router.get('/', ConversationController.getConversations);

/**
 * @swagger
 * /conversations/{id}:
 *   get:
 *     summary: Lấy thông tin một cuộc trò chuyện theo ID
 *     tags: [Conversations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của cuộc trò chuyện cần lấy
 *     responses:
 *       200:
 *         description: Trả về thông tin cuộc trò chuyện
 *       404:
 *         description: Không tìm thấy cuộc trò chuyện
 */
Router.get('/:id', ConversationController.getConversationById);

/**
 * @swagger
 * /conversations:
 *   post:
 *     summary: Tạo một cuộc trò chuyện mới
 *     tags: [Conversations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Conversation'
 *     responses:
 *       201:
 *         description: Cuộc trò chuyện được tạo thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 */
Router.post('/', ConversationController.createConversation);

/**
 * @swagger
 * /conversations/{id}:
 *   patch:
 *     summary: Cập nhật một cuộc trò chuyện theo ID
 *     tags: [Conversations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Conversation'
 *     responses:
 *       200:
 *         description: Cập nhật thành công cuộc trò chuyện
 *       404:
 *         description: Không tìm thấy cuộc trò chuyện
 */
Router.patch('/:id', ConversationController.updateConversationById);

/**
 * @swagger
 * /conversations:
 *   patch:
 *     summary: Cập nhật tất cả cuộc trò chuyện
 *     tags: [Conversations]
 *     responses:
 *       200:
 *         description: Cập nhật thành công tất cả cuộc trò chuyện
 */
Router.patch('/', ConversationController.updateAllConversations);

/**
 * @swagger
 * /conversations/{id}:
 *   delete:
 *     summary: Xóa một cuộc trò chuyện theo ID
 *     tags: [Conversations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cuộc trò chuyện đã được xóa thành công
 *       404:
 *         description: Không tìm thấy cuộc trò chuyện
 */
Router.delete('/:id', ConversationController.deleteConversationById);

export const conversationdRoute = Router;
