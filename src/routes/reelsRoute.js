import express from 'express';
import ReelsController from '../controllers/reelsController.js';

const Router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Reels
 *   description: API quản lý bài đăng dạng video ngắn (Reels)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Reels:
 *       type: object
 *       required:
 *         - createdBy
 *         - content
 *         - photo
 *       properties:
 *         createdBy:
 *           type: string
 *           description: ID của người tạo bài đăng
 *           example: "user123"
 *         reports:
 *           type: array
 *           description: Danh sách ID của những người đã báo cáo bài viết
 *           items:
 *             type: string
 *           example: ["user456", "user789"]
 *         content:
 *           type: string
 *           description: Nội dung của bài đăng
 *           example: "Hôm nay là một ngày đẹp trời!"
 *         address:
 *           type: string
 *           description: Địa điểm liên quan đến bài đăng (nếu có)
 *           example: "Hồ Gươm, Hà Nội"
 *         hashTag:
 *           type: array
 *           description: Danh sách hashtag liên quan
 *           items:
 *             type: string
 *           example: ["#travel", "#hanoi"]
 *         photo:
 *           type: string
 *           description: URL của ảnh hoặc video đi kèm bài đăng
 *           example: "https://example.com/image.jpg"
 *         scope:
 *           type: string
 *           description: Phạm vi hiển thị bài đăng (công khai, bạn bè,...)
 *           example: "public"
 *         emoticons:
 *           type: array
 *           description: Danh sách cảm xúc trên bài đăng
 *           items:
 *             type: string
 *           example: ["like", "love"]
 *         comments:
 *           type: array
 *           description: Danh sách ID của các bình luận
 *           items:
 *             type: string
 *           example: ["comment1", "comment2"]
 *         createdAt:
 *           type: number
 *           description: Thời gian tạo bài đăng (timestamp)
 *           example: 1708402200000
 *         updatedAt:
 *           type: number
 *           description: Thời gian cập nhật bài đăng gần nhất (timestamp)
 *           example: 1708498600000
 *         destroyAt:
 *           type: string
 *           format: date-time
 *           description: Thời gian bài đăng bị xóa (nếu có)
 *           example: "2025-12-31T23:59:59.999Z"
 */

/**
 * @swagger
 * /reels:
 *   get:
 *     summary: Lấy danh sách tất cả các bài đăng Reels
 *     tags: [Reels]
 *     responses:
 *       200:
 *         description: Danh sách các bài đăng Reels
 */
Router.get('/', ReelsController.getReels);

/**
 * @swagger
 * /reels/{id}:
 *   get:
 *     summary: Lấy thông tin một bài đăng Reels theo ID
 *     tags: [Reels]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của bài đăng Reels cần lấy
 *     responses:
 *       200:
 *         description: Trả về thông tin bài đăng Reels
 *       404:
 *         description: Không tìm thấy bài đăng Reels
 */
Router.get('/:id', ReelsController.getReelsById);

/**
 * @swagger
 * /reels:
 *   post:
 *     summary: Tạo một bài đăng Reels mới
 *     tags: [Reels]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Reels'
 *     responses:
 *       201:
 *         description: Bài đăng Reels được tạo thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 */
Router.post('/', ReelsController.createReels);

/**
 * @swagger
 * /reels/{id}:
 *   patch:
 *     summary: Cập nhật thông tin một bài đăng Reels theo ID
 *     tags: [Reels]
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
 *             $ref: '#/components/schemas/Reels'
 *     responses:
 *       200:
 *         description: Cập nhật thành công bài đăng Reels
 *       404:
 *         description: Không tìm thấy bài đăng Reels
 */
Router.patch('/:id', ReelsController.updateReelsById);

/**
 * @swagger
 * /reels:
 *   patch:
 *     summary: Cập nhật tất cả bài đăng Reels
 *     tags: [Reels]
 *     responses:
 *       200:
 *         description: Cập nhật thành công tất cả bài đăng Reels
 */
Router.patch('/', ReelsController.updateAllReels);

/**
 * @swagger
 * /reels/{id}:
 *   delete:
 *     summary: Xóa một bài đăng Reels theo ID
 *     tags: [Reels]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Bài đăng Reels đã được xóa thành công
 *       404:
 *         description: Không tìm thấy bài đăng Reels
 */
Router.delete('/:id', ReelsController.deleteReelsById);

export const reelsRoute = Router;
