import express from 'express';
import recentViewController from '../controllers/recentViewController.js';

const Router = express.Router();

/**
 * @swagger
 * tags:
 *   name: RecentViews
 *   description: API quản lý lượt xem gần đây
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     RecentView:
 *       type: object
 *       required:
 *         - idUser
 *         - view
 *       properties:
 *         idUser:
 *           type: string
 *           description: ID của người dùng
 *           example: "user123"
 *         view:
 *           type: array
 *           description: Danh sách lượt xem
 *           items:
 *             type: object
 *             properties:
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                   description: Các thẻ tag của lượt xem
 *                   example: "beach"
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: Ngày xem
 *                 example: "2025-04-26T12:00:00.000Z"
 *               action:
 *                 type: string
 *                 enum: [View, Like]
 *                 description: Hành động (xem hoặc thích)
 *                 example: "View"
 */

/**
 * @swagger
 * /recent-view:
 *   get:
 *     summary: Lấy danh sách tất cả lượt xem gần đây
 *     tags: [RecentViews]
 *     responses:
 *       200:
 *         description: Danh sách lượt xem gần đây
 */
Router.get('/', recentViewController.getRecentViews);

/**
 * @swagger
 * /recent-view/{id}:
 *   get:
 *     summary: Lấy lượt xem gần đây theo ID
 *     tags: [RecentViews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của lượt xem gần đây
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Chi tiết lượt xem gần đây
 *       404:
 *         description: Không tìm thấy
 */
Router.get('/:id', recentViewController.getRecentViewById);

/**
 * @swagger
 * /recent-view:
 *   post:
 *     summary: Tạo mới lượt xem gần đây
 *     tags: [RecentViews]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idUser:
 *                 type: string
 *                 description: ID của người dùng
 *                 example: "67d2e85d1a29ef48e08a19ef"
 *               view:
 *                 type: array
 *                 description: Danh sách lượt xem
 *                 items:
 *                   type: object
 *                   properties:
 *                     tags:
 *                       type: array
 *                       items:
 *                         type: string
 *                         enum:
 *                           - mountain
 *                           - beach
 *                           - forest
 *                           - grassland
 *                           - desert
 *                           - river
 *                           - lake
 *                           - waterfall
 *                           - cave
 *                           - rice_field
 *                           - flower_field
 *                           - sky
 *                           - island
 *                           - volcano
 *                           - national_park
 *                           - canyon
 *                           - snow
 *                           - wildlife
 *                           - bird
 *                           - livestock
 *                           - marine_life
 *                           - festival
 *                           - traditional_costume
 *                           - market
 *                           - cuisine
 *                           - village
 *                           - local_people
 *                           - ceremony
 *                           - street_art
 *                           - historical_site
 *                           - landmark
 *                           - bridge
 *                           - cityscape
 *                           - traditional_house
 *                           - old_town
 *                           - castle
 *                           - trekking
 *                           - diving
 *                           - camping
 *                           - kayaking
 *                           - hot_air_balloon
 *                           - cycling
 *                           - motorcycling
 *                           - skiing
 *                           - surfing
 *                           - paragliding
 *                           - street
 *                           - transport
 *                           - tree
 *                           - weather
 *                           - light
 *                           - signpost
 *                           - season
 *                           - sunset
 *                           - sunrise
 *                           - aurora
 *                           - night_sky
 *                           - rock
 *                           - lantern
 *                           - photography
 *                           - clouds
 *                     action:
 *                       type: string
 *                       enum: [View, Like]
 *                       description: Hành động
 *                       example: "View"
 *     responses:
 *       201:
 *         description: Tạo lượt xem gần đây thành công
 */
Router.post('/', recentViewController.createRecentView);


/**
 * @swagger
 * /recent-view/{id}:
 *   patch:
 *     summary: Cập nhật lượt xem gần đây theo ID
 *     tags: [RecentViews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của lượt xem gần đây
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RecentView'
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       404:
 *         description: Không tìm thấy
 */
Router.patch('/:id', recentViewController.updateRecentViewById);

/**
 * @swagger
 * /recent-view:
 *   patch:
 *     summary: Cập nhật tất cả lượt xem gần đây
 *     tags: [RecentViews]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Dữ liệu cập nhật hàng loạt
 *     responses:
 *       200:
 *         description: Cập nhật tất cả thành công
 */
Router.patch('/', recentViewController.updateAllRecentViews);

/**
 * @swagger
 * /recent-view/{id}:
 *   delete:
 *     summary: Xóa lượt xem gần đây theo ID (Soft Delete)
 *     tags: [RecentViews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của lượt xem gần đây
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Xóa thành công
 *       404:
 *         description: Không tìm thấy
 */
Router.delete('/:id', recentViewController.deleteRecentViewById);

export const recentViewRoute = Router;
