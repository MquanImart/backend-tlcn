import express from 'express';
import { historySearchController } from '../controllers/historySearchController.js';

const Router = express.Router();

/**
 * @swagger
 * tags:
 *   name: HistorySearches
 */

/**
 * @swagger
 * /historysearches:
 *   get:
 *     summary: Lấy danh sách lịch sử tìm kiếm
 *     tags: [HistorySearches]
 *     responses:
 *       200:
 *         description: Trả về danh sách lịch sử tìm kiếm
 */
Router.get('/', historySearchController.getHistorySearches);

/**
 * @swagger
 * /historysearches/{id}:
 *   get:
 *     summary: Lấy lịch sử tìm kiếm theo ID
 *     tags: [HistorySearches]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của lịch sử tìm kiếm cần lấy
 *     responses:
 *       200:
 *         description: Trả về lịch sử tìm kiếm
 */
Router.get('/:id', historySearchController.getHistorySearchById);

/**
 * @swagger
 * /historysearches:
 *   post:
 *     summary: Tạo lịch sử tìm kiếm mới
 *     tags: [HistorySearches]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idUser:
 *                 type: string
 *                 example: "60f7ebeb2f8fb814b56fa181"
 *               keySearch:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "search term"
 *               data:
 *                 type: string
 *                 example: "additional data"
 *     responses:
 *       201:
 *         description: Tạo lịch sử tìm kiếm thành công
 */
Router.post('/', historySearchController.createHistorySearch);

/**
 * @swagger
 * /historysearches/{id}:
 *   patch:
 *     summary: Cập nhật lịch sử tìm kiếm theo ID
 *     tags: [HistorySearches]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của lịch sử tìm kiếm cần cập nhật
 *     responses:
 *       200:
 *         description: Cập nhật lịch sử tìm kiếm thành công
 */
Router.patch('/:id', historySearchController.updateHistorySearchById);

/**
 * @swagger
 * /historysearches:
 *   patch:
 *     summary: Cập nhật tất cả lịch sử tìm kiếm
 *     tags: [HistorySearches]
 *     responses:
 *       200:
 *         description: Cập nhật tất cả lịch sử tìm kiếm thành công
 */
Router.patch('/', historySearchController.updateAllHistorySearches);

/**
 * @swagger
 * /historysearches/{id}:
 *   delete:
 *     summary: Xóa lịch sử tìm kiếm theo ID
 *     tags: [HistorySearches]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của lịch sử tìm kiếm cần xóa
 *     responses:
 *       200:
 *         description: Xóa lịch sử tìm kiếm thành công
 */
Router.delete('/:id', historySearchController.deleteHistorySearchById);

export const historySearchRoute = Router;
