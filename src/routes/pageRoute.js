import express from 'express';
import { pageController } from '../controllers/pageController.js';

const Router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Pages
 */

/**
 * @swagger
 * /pages:
 *   get:
 *     summary: Lấy danh sách Pages
 *     tags: [Pages]
 *     responses:
 *       200:
 *         description: Trả về danh sách Pages
 */
Router.get('/', pageController.getPages);

/**
 * @swagger
 * /pages/{id}:
 *   get:
 *     summary: Lấy Page theo ID
 *     tags: [Pages]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của Page cần lấy
 *     responses:
 *       200:
 *         description: Trả về Page
 */
Router.get('/:id', pageController.getPageById);

/**
 * @swagger
 * /pages:
 *   post:
 *     summary: Tạo Page mới
 *     tags: [Pages]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Trang học tập"
 *               idCreater:
 *                 type: string
 *                 example: "60f7ebeb2f8fb814b56fa181"
 *     responses:
 *       201:
 *         description: Tạo Page thành công
 */
Router.post('/', pageController.createPage);

/**
 * @swagger
 * /pages/{id}:
 *   patch:
 *     summary: Cập nhật Page theo ID
 *     tags: [Pages]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của Page cần cập nhật
 *     responses:
 *       200:
 *         description: Cập nhật Page thành công
 */
Router.patch('/:id', pageController.updatePageById);

/**
 * @swagger
 * /pages:
 *   patch:
 *     summary: Cập nhật tất cả Pages
 *     tags: [Pages]
 *     responses:
 *       200:
 *         description: Cập nhật tất cả Pages thành công
 */
Router.patch('/', pageController.updateAllPages);

/**
 * @swagger
 * /pages/{id}:
 *   delete:
 *     summary: Xóa Page theo ID
 *     tags: [Pages]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của Page cần xóa
 *     responses:
 *       200:
 *         description: Xóa Page thành công
 */
Router.delete('/:id', pageController.deletePageById);

export const pageRoute = Router;