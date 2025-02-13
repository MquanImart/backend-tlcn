import express from 'express';
import { identificationController } from '../controllers/identificationController.js';

const Router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Identifications
 */

/**
 * @swagger
 * /identifications:
 *   get:
 *     summary: Lấy danh sách chứng minh thư
 *     tags: [Identifications]
 *     responses:
 *       200:
 *         description: Trả về danh sách chứng minh thư
 */
Router.get('/', identificationController.getIdentifications);

/**
 * @swagger
 * /identifications/{id}:
 *   get:
 *     summary: Lấy chứng minh thư theo ID
 *     tags: [Identifications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của chứng minh thư cần lấy
 *     responses:
 *       200:
 *         description: Trả về chứng minh thư
 */
Router.get('/:id', identificationController.getIdentificationById);

/**
 * @swagger
 * /identifications:
 *   post:
 *     summary: Tạo chứng minh thư mới
 *     tags: [Identifications]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               number:
 *                 type: string
 *                 example: "1234567890"
 *               fullName:
 *                 type: string
 *                 example: "Nguyễn Văn A"
 *               dateOfBirth:
 *                 type: string
 *                 example: "1990-01-01"
 *               sex:
 *                 type: string
 *                 example: "male"
 *               nationality:
 *                 type: string
 *                 example: "Vietnamese"
 *               placeOfOrigin:
 *                 type: string
 *                 example: "Hà Nội"
 *               placeOfResidence:
 *                 type: string
 *                 example: "Hà Nội"
 *               dateOfExpiry:
 *                 type: string
 *                 example: "2030-12-31"
 *     responses:
 *       201:
 *         description: Tạo chứng minh thư thành công
 */
Router.post('/', identificationController.createIdentification);

/**
 * @swagger
 * /identifications/{id}:
 *   patch:
 *     summary: Cập nhật chứng minh thư theo ID
 *     tags: [Identifications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của chứng minh thư cần cập nhật
 *     responses:
 *       200:
 *         description: Cập nhật chứng minh thư thành công
 */
Router.patch('/:id', identificationController.updateIdentificationById);

/**
 * @swagger
 * /identifications:
 *   patch:
 *     summary: Cập nhật tất cả chứng minh thư
 *     tags: [Identifications]
 *     responses:
 *       200:
 *         description: Cập nhật tất cả chứng minh thư thành công
 */
Router.patch('/', identificationController.updateAllIdentifications);

/**
 * @swagger
 * /identifications/{id}:
 *   delete:
 *     summary: Xóa chứng minh thư theo ID
 *     tags: [Identifications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của chứng minh thư cần xóa
 *     responses:
 *       200:
 *         description: Xóa chứng minh thư thành công
 */
Router.delete('/:id', identificationController.deleteIdentificationById);

export const identificationRoute = Router;
