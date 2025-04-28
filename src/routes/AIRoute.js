import express from 'express';
import { addressController } from '../controllers/addressController.js';
import SuggestTouristController from '../AI-algorithms/suggested-tourist-spots/API_Suggested.js';

const Router = express.Router();

/**
 * @swagger
 * tags:
 *   name: AI
 */

/**
 * @swagger
 * /ai/suggested-touris/{id}:
 *   get:
 *     summary: Lấy danh sách địa điểm gợi ý
 *     tags: [AI]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của người dùng
 *         schema:
 *           type: string
 *           example: "67d2e85d1a29ef48e08a19ef"
 *     responses:
 *       200:
 *         description: Trả về danh sách địa điểm gợi ý
 */
Router.get('/suggested-touris/:id', SuggestTouristController.suggestTouristForUser);



export const AIRoute = Router;