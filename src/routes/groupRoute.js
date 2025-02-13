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
 *             properties:
 *               groupName:
 *                 type: string
 *                 example: "Nhóm học tập"
 *               warningLevel:
 *                 type: number
 *                 enum: [0, 1, 2, 3]
 *                 example: 1
 *               type:
 *                 type: string
 *                 enum: ['public', 'private']
 *                 example: "private"
 *     responses:
 *       201:
 *         description: Tạo nhóm thành công
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

export const groupRoute = Router;
