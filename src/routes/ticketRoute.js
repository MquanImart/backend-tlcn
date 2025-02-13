import express from 'express';
import { ticketController } from '../controllers/ticketController.js';

const Router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Tickets
 */

/**
 * @swagger
 * /tickets:
 *   get:
 *     summary: Lấy danh sách vé
 *     tags: [Tickets]
 *     responses:
 *       200:
 *         description: Trả về danh sách vé
 */
Router.get('/', ticketController.getTickets);

/**
 * @swagger
 * /tickets/{id}:
 *   get:
 *     summary: Lấy vé theo ID
 *     tags: [Tickets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của vé cần lấy
 *     responses:
 *       200:
 *         description: Trả về vé
 */
Router.get('/:id', ticketController.getTicketById);

/**
 * @swagger
 * /tickets:
 *   post:
 *     summary: Tạo vé mới
 *     tags: [Tickets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Vé VIP"
 *               price:
 *                 type: number
 *                 example: 100
 *               description:
 *                 type: string
 *                 example: "Vé dành cho khách VIP"
 *     responses:
 *       201:
 *         description: Tạo vé thành công
 */
Router.post('/', ticketController.createTicket);

/**
 * @swagger
 * /tickets/{id}:
 *   patch:
 *     summary: Cập nhật vé theo ID
 *     tags: [Tickets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của vé cần cập nhật
 *     responses:
 *       200:
 *         description: Cập nhật vé thành công
 */
Router.patch('/:id', ticketController.updateTicketById);

/**
 * @swagger
 * /tickets:
 *   patch:
 *     summary: Cập nhật tất cả vé
 *     tags: [Tickets]
 *     responses:
 *       200:
 *         description: Cập nhật tất cả vé thành công
 */
Router.patch('/', ticketController.updateAllTickets);

/**
 * @swagger
 * /tickets/{id}:
 *   delete:
 *     summary: Xóa vé theo ID
 *     tags: [Tickets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của vé cần xóa
 *     responses:
 *       200:
 *         description: Xóa vé thành công
 */
Router.delete('/:id', ticketController.deleteTicketById);

export const ticketRoute = Router;
