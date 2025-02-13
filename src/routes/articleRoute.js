import express from 'express';
import { articleController } from '../controllers/articleController.js';

const Router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Articles
 */

/**
 * @swagger
 * /articles:
 *   get:
 *     summary: Lấy danh sách bài viết
 *     tags: [Articles]
 *     responses:
 *       200:
 *         description: Trả về danh sách bài viết
 */
Router.get('/', articleController.getArticles);

/**
 * @swagger
 * /articles/{id}:
 *   get:
 *     summary: Lấy bài viết theo ID
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của bài viết cần lấy
 *     responses:
 *       200:
 *         description: Trả về bài viết
 */
Router.get('/:id', articleController.getArticleById);

/**
 * @swagger
 * /articles:
 *   post:
 *     summary: Tạo bài viết mới
 *     tags: [Articles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               createdBy:
 *                 type: string
 *                 example: "60f7ebeb2f8fb814b56fa181"
 *               sharedPostId:
 *                 type: string
 *                 example: "60f7ebeb2f8fb814b56fa182"
 *               content:
 *                 type: string
 *                 example: "Bài viết mới"
 *               hashTag:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: ["hashtag1", "hashtag2"]
 *     responses:
 *       201:
 *         description: Tạo bài viết thành công
 */
Router.post('/', articleController.createArticle);

/**
 * @swagger
 * /articles/{id}:
 *   patch:
 *     summary: Cập nhật bài viết theo ID
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của bài viết cần cập nhật
 *     responses:
 *       200:
 *         description: Cập nhật bài viết thành công
 */
Router.patch('/:id', articleController.updateArticleById);

/**
 * @swagger
 * /articles:
 *   patch:
 *     summary: Cập nhật tất cả bài viết
 *     tags: [Articles]
 *     responses:
 *       200:
 *         description: Cập nhật tất cả bài viết thành công
 */
Router.patch('/', articleController.updateAllArticles);

/**
 * @swagger
 * /articles/{id}:
 *   delete:
 *     summary: Xóa bài viết theo ID
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của bài viết cần xóa
 *     responses:
 *       200:
 *         description: Xóa bài viết thành công
 */
Router.delete('/:id', articleController.deleteArticleById);

export const articleRoute = Router;
