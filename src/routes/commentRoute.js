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
 *     description: |
 *       - **Bình luận cấp 1** (trên bài viết): Chỉ cần truyền `articleId`
 *       - **Bình luận cấp 2+** (trả lời bình luận khác): Chỉ cần truyền `replyComment`
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
 *                 description: ID của người bình luận
 *                 example: "60f7ebeb2f8fb814b56fa181"
 *               content:
 *                 type: string
 *                 description: Nội dung bình luận
 *                 example: "Đây là một bình luận"
 *               img:
 *                 type: array
 *                 description: Danh sách hình ảnh đính kèm bình luận
 *                 items:
 *                   type: string
 *                 example: ["image-url-1", "image-url-2"]
 *               articleId:
 *                 type: string
 *                 description: ID của bài viết (chỉ dùng cho bình luận cấp 1)
 *                 example: "65d2ebeb2f8fb814b56fa111"
 *               replyComment:
 *                 type: string
 *                 description: ID của bình luận cha (chỉ dùng khi trả lời bình luận khác)
 *                 example: "65d2ebeb2f8fb814b56fa112"
 *     responses:
 *       201:
 *         description: Bình luận được tạo thành công
 *       400:
 *         description: Thiếu thông tin bắt buộc (`_iduser` hoặc `content`)
 *       404:
 *         description: Bài viết hoặc bình luận cha không tồn tại
 *       500:
 *         description: Lỗi máy chủ khi xử lý yêu cầu
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
