import express from 'express';
import { groupController } from '../controllers/groupController.js';

const Router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Groups
 */

/**
 * @swagger
 * /groups:
 *   get:
 *     summary: Lấy danh sách nhóm
 *     tags: [Groups]
 *     responses:
 *       200:
 *         description: Trả về danh sách nhóm
 */
Router.get('/', groupController.getGroups);

/**
 * @swagger
 * /groups/{id}:
 *   get:
 *     summary: Lấy nhóm theo ID
 *     tags: [Groups]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của nhóm cần lấy
 *     responses:
 *       200:
 *         description: Trả về nhóm
 */
Router.get('/:id', groupController.getGroupById);

/**
 * @swagger
 * /groups:
 *   post:
 *     summary: Tạo nhóm mới
 *     tags: [Groups]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - groupName
 *               - warningLevel
 *               - type
 *               - idCreater
 *             properties:
 *               groupName:
 *                 type: string
 *                 description: Tên của nhóm
 *                 example: "Nhóm học tập"
 *               warningLevel:
 *                 type: integer
 *                 enum: [0, 1, 2, 3]
 *                 description: Mức độ cảnh báo của nhóm (0 - Bình thường, 3 - Cảnh báo cao)
 *                 example: 1
 *               type:
 *                 type: string
 *                 enum: ['public', 'private']
 *                 description: Loại nhóm (public hoặc private)
 *                 example: "private"
 *               idCreater:
 *                 type: string
 *                 format: ObjectId
 *                 description: ID của người tạo nhóm
 *                 example: "60f7ebeb2f8fb814b56fa181"
 *               introduction:
 *                 type: string
 *                 description: Giới thiệu về nhóm
 *                 example: "Nhóm này dành cho những ai yêu thích học tập và nghiên cứu."
 *               avt:
 *                 type: string
 *                 format: ObjectId
 *                 description: ID của ảnh đại diện nhóm
 *                 example: "60f7ebeb2f8fb814b56fa182"
 *               rule:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Danh sách các quy tắc của nhóm
 *                 example: ["Không spam", "Không đăng nội dung vi phạm pháp luật"]
 *               hobbies:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: ObjectId
 *                 description: Danh sách sở thích liên quan đến nhóm
 *                 example: ["60f7ebeb2f8fb814b56fa183", "60f7ebeb2f8fb814b56fa184"]
 *     responses:
 *       201:
 *         description: Nhóm được tạo thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Group'
 *                 message:
 *                   type: string
 *                   example: "Tạo nhóm thành công"
 *       400:
 *         description: Lỗi dữ liệu đầu vào không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Dữ liệu không hợp lệ"
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Lỗi máy chủ"
 */

Router.post('/', groupController.createGroup);

/**
 * @swagger
 * /groups/{id}:
 *   patch:
 *     summary: Cập nhật nhóm theo ID
 *     tags: [Groups]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của nhóm cần cập nhật
 *     responses:
 *       200:
 *         description: Cập nhật nhóm thành công
 */
Router.patch('/:id', groupController.updateGroupById);

/**
 * @swagger
 * /groups:
 *   patch:
 *     summary: Cập nhật tất cả nhóm
 *     tags: [Groups]
 *     responses:
 *       200:
 *         description: Cập nhật tất cả nhóm thành công
 */
Router.patch('/', groupController.updateAllGroups);

/**
 * @swagger
 * /groups/{id}:
 *   delete:
 *     summary: Xóa nhóm theo ID
 *     tags: [Groups]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của nhóm cần xóa
 *     responses:
 *       200:
 *         description: Xóa nhóm thành công
 */
Router.delete('/:id', groupController.deleteGroupById);

/**
 * @swagger
 * /groups/{id}/join:
 *   patch:
 *     summary: Gửi hoặc hủy yêu cầu tham gia nhóm
 *     tags: [Groups]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của nhóm cần tham gia hoặc hủy yêu cầu
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID của người dùng gửi yêu cầu tham gia hoặc hủy yêu cầu
 *                 example: "60f7ebeb2f8fb814b56fa181"
 *     responses:
 *       200:
 *         description: Xử lý thành công
 *       400:
 *         description: Lỗi dữ liệu hoặc trạng thái không hợp lệ
 *       404:
 *         description: Nhóm không tồn tại
 *       500:
 *         description: Lỗi server
 */
Router.patch('/:id/join', groupController.requestJoinOrLeaveGroup);



export const groupRoute = Router;
