import express from 'express';
import { tripController } from '../controllers/tripController.js';

const Router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Trips
 */

/**
 * @swagger
 * /trips:
 *   get:
 *     summary: Lấy danh sách chuyến đi
 *     tags: [Trips]
 *     responses:
 *       200:
 *         description: Trả về danh sách chuyến đi
 */
Router.get('/', tripController.getTrips);

/**
 * @swagger
 * /trips/{id}:
 *   get:
 *     summary: Lấy chuyến đi theo ID
 *     tags: [Trips]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của chuyến đi cần lấy
 *     responses:
 *       200:
 *         description: Trả về chuyến đi
 */
Router.get('/:id', tripController.getTripById);

/**
 * @swagger
 * /trips:
 *   post:
 *     summary: Tạo chuyến đi mới
 *     tags: [Trips]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Chuyến đi Hà Nội"
 *               startAddress:
 *                 type: string
 *                 example: "60f7ebeb2f8fb814b56fa181"
 *               listAddress:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "60f7ebeb2f8fb814b56fa182"
 *               endAddress:
 *                 type: string
 *                 example: "60f7ebeb2f8fb814b56fa183"
 *     responses:
 *       201:
 *         description: Tạo chuyến đi thành công
 */
Router.post('/', tripController.createTrip);

/**
 * @swagger
 * /trips/{id}:
 *   patch:
 *     summary: Cập nhật chuyến đi theo ID
 *     tags: [Trips]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của chuyến đi cần cập nhật
 *     responses:
 *       200:
 *         description: Cập nhật chuyến đi thành công
 */
Router.patch('/:id', tripController.updateTripById);

/**
 * @swagger
 * /trips:
 *   patch:
 *     summary: Cập nhật tất cả chuyến đi
 *     tags: [Trips]
 *     responses:
 *       200:
 *         description: Cập nhật tất cả chuyến đi thành công
 */
Router.patch('/', tripController.updateAllTrips);

/**
 * @swagger
 * /trips/{id}:
 *   delete:
 *     summary: Xóa chuyến đi theo ID
 *     tags: [Trips]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của chuyến đi cần xóa
 *     responses:
 *       200:
 *         description: Xóa chuyến đi thành công
 */
Router.delete('/:id', tripController.deleteTripById);

export const tripRoute = Router;
