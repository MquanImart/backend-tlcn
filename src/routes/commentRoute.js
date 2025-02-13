import express from 'express';
import { commentController } from '../controllers/commentController.js';

const Router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Comments
 */

/**
 * @swagger
 * /comments:
 *   get:
 *     summary: Lấy danh sách bình luận
 *     tags: [Comments]
 *     responses:
 *       200:
 *         description: Trả về danh sách bình luận
 */
Router.get('/', commentController.getComments);

/**
 * @swagger
 * /comments/{id}:
 *   get:
 *     summary: Lấy bình luận theo ID
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của bình luận cần lấy
 *     responses:
 *       200:
 *         description: Trả về bình luận
 */
Router.get('/:id', commentController.getCommentById);

/**
 * @swagger
 * /comments:
 *   post:
 *     summary: Tạo bình luận mới
 *     tags: [Comments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               _iduser:
 *                 type: string
 *                 example: "60f7ebeb2f8fb814b56fa181"
 *               content:
 *                 type: string
 *                 example: "Bình luận của tôi"
 *               img:
 *                 type: string
 *                 example: "image-url"
 *               replyComment:
 *                 type: string
 *                 example: "60f7ebeb2f8fb814b56fa182"
 *               emoticons:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "60f7ebeb2f8fb814b56fa181"
 *     responses:
 *       201:
 *         description: Tạo bình luận thành công
 */
Router.post('/', commentController.createComment);

/**
 * @swagger
 * /comments/{id}:
 *   patch:
 *     summary: Cập nhật bình luận theo ID
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của bình luận cần cập nhật
 *     responses:
 *       200:
 *         description: Cập nhật bình luận thành công
 */
Router.patch('/:id', commentController.updateCommentById);

/**
 * @swagger
 * /comments:
 *   patch:
 *     summary: Cập nhật tất cả bình luận
 *     tags: [Comments]
 *     responses:
 *       200:
 *         description: Cập nhật tất cả bình luận thành công
 */
Router.patch('/', commentController.updateAllComments);

/**
 * @swagger
 * /comments/{id}:
 *   delete:
 *     summary: Xóa bình luận theo ID
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của bình luận cần xóa
 *     responses:
 *       200:
 *         description: Xóa bình luận thành công
 */
Router.delete('/:id', commentController.deleteCommentById);

export const commentRoute = Router;
