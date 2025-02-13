import express from 'express';
import { myPhotoController } from '../controllers/myPhotoController.js';

const Router = express.Router();

/**
 * @swagger
 * tags:
 *   name: MyPhotos
 */

/**
 * @swagger
 * /myphotos:
 *   get:
 *     summary: Lấy danh sách ảnh/video/ghi âm
 *     tags: [MyPhotos]
 *     responses:
 *       200:
 *         description: Trả về danh sách ảnh/video/ghi âm
 */
Router.get('/', myPhotoController.getMyPhotos);

/**
 * @swagger
 * /myphotos/{id}:
 *   get:
 *     summary: Lấy ảnh/video/ghi âm theo ID
 *     tags: [MyPhotos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của ảnh/video/ghi âm cần lấy
 *     responses:
 *       200:
 *         description: Trả về ảnh/video/ghi âm
 */
Router.get('/:id', myPhotoController.getMyPhotoById);

/**
 * @swagger
 * /myphotos:
 *   post:
 *     summary: Tạo ảnh/video/ghi âm mới
 *     tags: [MyPhotos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Hình ảnh biển"
 *               idAuthor:
 *                 type: string
 *                 example: "60f7ebeb2f8fb814b56fa181"
 *               type:
 *                 type: string
 *                 enum: ['img', 'video', 'record']
 *                 example: "img"
 *               url:
 *                 type: string
 *                 example: "https://example.com/image.jpg"
 *     responses:
 *       201:
 *         description: Tạo ảnh/video/ghi âm thành công
 */
Router.post('/', myPhotoController.createMyPhoto);

/**
 * @swagger
 * /myphotos/{id}:
 *   patch:
 *     summary: Cập nhật ảnh/video/ghi âm theo ID
 *     tags: [MyPhotos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của ảnh/video/ghi âm cần cập nhật
 *     responses:
 *       200:
 *         description: Cập nhật ảnh/video/ghi âm thành công
 */
Router.patch('/:id', myPhotoController.updateMyPhotoById);

/**
 * @swagger
 * /myphotos:
 *   patch:
 *     summary: Cập nhật tất cả ảnh/video/ghi âm
 *     tags: [MyPhotos]
 *     responses:
 *       200:
 *         description: Cập nhật tất cả ảnh/video/ghi âm thành công
 */
Router.patch('/', myPhotoController.updateAllMyPhotos);

/**
 * @swagger
 * /myphotos/{id}:
 *   delete:
 *     summary: Xóa ảnh/video/ghi âm theo ID
 *     tags: [MyPhotos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của ảnh/video/ghi âm cần xóa
 *     responses:
 *       200:
 *         description: Xóa ảnh/video/ghi âm thành công
 */
Router.delete('/:id', myPhotoController.deleteMyPhotoById);

export const myPhotoRoute = Router;
