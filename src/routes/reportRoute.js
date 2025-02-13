import express from 'express';
import { reportController } from '../controllers/reportController.js';

const Router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Reports
 */

/**
 * @swagger
 * /reports:
 *   get:
 *     summary: Lấy danh sách báo cáo
 *     tags: [Reports]
 *     responses:
 *       200:
 *         description: Trả về danh sách báo cáo
 */
Router.get('/', reportController.getReports);

/**
 * @swagger
 * /reports/{id}:
 *   get:
 *     summary: Lấy báo cáo theo ID
 *     tags: [Reports]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của báo cáo cần lấy
 *     responses:
 *       200:
 *         description: Trả về báo cáo
 */
Router.get('/:id', reportController.getReportById);

/**
 * @swagger
 * /reports:
 *   post:
 *     summary: Tạo báo cáo mới
 *     tags: [Reports]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               _idReporter:
 *                 type: string
 *                 example: "60f7ebeb2f8fb814b56fa181"
 *               reason:
 *                 type: string
 *                 example: "Nội dung vi phạm"
 *               status:
 *                 type: string
 *                 enum: ['pending', 'accepted', 'rejected']
 *                 example: "pending"
 *     responses:
 *       201:
 *         description: Tạo báo cáo thành công
 */
Router.post('/', reportController.createReport);

/**
 * @swagger
 * /reports/{id}:
 *   patch:
 *     summary: Cập nhật báo cáo theo ID
 *     tags: [Reports]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của báo cáo cần cập nhật
 *     responses:
 *       200:
 *         description: Cập nhật báo cáo thành công
 */
Router.patch('/:id', reportController.updateReportById);

/**
 * @swagger
 * /reports:
 *   patch:
 *     summary: Cập nhật tất cả báo cáo
 *     tags: [Reports]
 *     responses:
 *       200:
 *         description: Cập nhật tất cả báo cáo thành công
 */
Router.patch('/', reportController.updateAllReports);

/**
 * @swagger
 * /reports/{id}:
 *   delete:
 *     summary: Xóa báo cáo theo ID
 *     tags: [Reports]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của báo cáo cần xóa
 *     responses:
 *       200:
 *         description: Xóa báo cáo thành công
 */
Router.delete('/:id', reportController.deleteReportById);

export const reportRoute = Router;
