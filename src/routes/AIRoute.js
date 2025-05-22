import express from 'express';
import SuggestTouristController from '../AI-algorithms/suggested-tourist-spots/index.js';
import RouteSuggestions from '../AI-algorithms/route-suggestions/index.js';

const Router = express.Router();

/**
 * @swagger
 * tags:
 *   name: AI
 */

/**
 * @swagger
 * /ai/suggested-page-CF/{id}:
 *   get:
 *     summary: Lấy danh sách địa điểm gợi ý CF
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
Router.get('/suggested-page-CF/:id', SuggestTouristController.suggestedPageCF);

/**
 * @swagger
 * /ai/suggested-page-CB/{id}:
 *   get:
 *     summary: Lấy danh sách địa điểm gợi ý CB
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
Router.get('/suggested-page-CB/:id', SuggestTouristController.suggestedPageCB);

/**
 * @swagger
 * /ai/suggested-page-month/{id}:
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
 *       - in: query
 *         name: month
 *         required: false
 *         description: Tháng muốn gợi ý địa điểm (1-12)
 *         schema:
 *           type: integer
 *           example: 5
 *     query:
 *     responses:
 *       200:
 *         description: Trả về danh sách địa điểm gợi ý
 */
Router.get('/suggested-page-month/:id', SuggestTouristController.suggestedPageMonth);

/**
 * @swagger
 * /ai/route-suggestions:
 *   post:
 *     summary: Lấy danh sách địa điểm gợi ý
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tripId:
 *                 type: string
 *                 description: ID của chuyến đi
 *                 example: "67ef738bb891eb4eb9c060e9"
 *               startDateTime:
 *                 type: string
 *                 format: date-time
 *                 description: Thời gian khởi hành (ISO 8601)
 *               useDistance:
 *                 type: boolean
 *                 description: Sử dụng gợi ý theo khoảng cách
 *               useDuration:
 *                 type: boolean
 *                 description: Sử dụng gợi ý theo thời gian
 *               visitingTime:
 *                 type: object
 *                 description: Thời gian tham quan tại từng điểm theo index trong danh sách điểm (tính bằng phút). Index bắt đầu từ 0.
 *                 additionalProperties:
 *                      type: integer
 *                      description: Số phút tham quan tại điểm đó
 *                 example:
 *                      1: 45
 *                      2: 30
 *                      3: 60
 *     responses:
 *       200:
 *         description: Trả về danh sách địa điểm gợi ý
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 orderedLocations:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       displayName:
 *                         type: string
 *                       latitude:
 *                         type: number
 *                       longitude:
 *                         type: number
 *                       address:
 *                         type: string
 *                       idealVisitTime:
 *                         type: object
 *                         properties:
 *                           startHour:
 *                             type: integer
 *                           endHour:
 *                             type: integer
 *                 arrivalTimes:
 *                   type: array
 *                   items:
 *                     type: string
 *                 totalDurationInMinutes:
 *                   type: integer
 */

Router.post('/route-suggestions', RouteSuggestions.routeSuggested);


export const AIRoute = Router;