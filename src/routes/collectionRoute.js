import express from 'express';
import CollectionController from '../controllers/collectionController.js';

const Router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Collections
 *   description: API quản lý bộ sưu tập
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Collection:
 *       type: object
 *       required:
 *         - name
 *         - items
 *         - type
 *       properties:
 *         name:
 *           type: string
 *           description: Tên bộ sưu tập
 *           example: "Bộ sưu tập mùa hè"
 *         items:
 *           type: array
 *           description: Danh sách các mục trong bộ sưu tập
 *           items:
 *             type: string
 *           example: ["item1", "item2", "item3"]
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Thời gian tạo bộ sưu tập
 *           example: "2025-02-20T12:34:56.789Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Thời gian cập nhật bộ sưu tập gần nhất
 *           example: "2025-02-21T14:00:00.000Z"
 *         _destroy:
 *           type: string
 *           format: date-time
 *           description: Thời gian bộ sưu tập bị xóa (nếu có)
 *           example: null
 *         type:
 *           type: string
 *           enum: [article, reels]
 *           description: Loại bộ sưu tập (bài viết hoặc video ngắn)
 *           example: "article"
 */

/**
 * @swagger
 * /collections:
 *   get:
 *     summary: Lấy danh sách tất cả bộ sưu tập
 *     tags: [Collections]
 *     responses:
 *       200:
 *         description: Danh sách tất cả bộ sưu tập
 */
Router.get('/', CollectionController.getCollections);

/**
 * @swagger
 * /collections/{id}:
 *   get:
 *     summary: Lấy thông tin một bộ sưu tập theo ID
 *     tags: [Collections]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của bộ sưu tập cần lấy
 *     responses:
 *       200:
 *         description: Trả về thông tin bộ sưu tập
 *       404:
 *         description: Không tìm thấy bộ sưu tập
 */
Router.get('/:id', CollectionController.getCollectionById);

/**
 * @swagger
 * /collections:
 *   post:
 *     summary: Tạo một bộ sưu tập mới
 *     tags: [Collections]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - items
 *               - type
 *             properties:
 *               name:
 *                 type: string
 *                 description: Tên bộ sưu tập
 *                 example: "Bộ sưu tập mùa hè"
 *               items:
 *                 type: array
 *                 description: Danh sách các mục trong bộ sưu tập
 *                 items:
 *                   type: string
 *                 example: ["item1", "item2", "item3"]
 *               type:
 *                 type: string
 *                 enum: [article, reels]
 *                 description: Loại bộ sưu tập (bài viết hoặc video ngắn)
 *                 example: "article"
 *     responses:
 *       201:
 *         description: Bộ sưu tập được tạo thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 */
Router.post('/', CollectionController.createCollection);

/**
 * @swagger
 * /collections/{id}:
 *   patch:
 *     summary: Cập nhật một bộ sưu tập theo ID
 *     tags: [Collections]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - items
 *               - type
 *             properties:
 *               name:
 *                 type: string
 *                 description: Tên bộ sưu tập
 *                 example: "Bộ sưu tập mùa hè"
 *               items:
 *                 type: array
 *                 description: Danh sách các mục trong bộ sưu tập
 *                 items:
 *                   type: string
 *                 example: ["item1", "item2", "item3"]
 *     responses:
 *       200:
 *         description: Cập nhật thành công bộ sưu tập
 *       404:
 *         description: Không tìm thấy bộ sưu tập
 */
Router.patch('/:id', CollectionController.updateCollectionById);

/**
 * @swagger
 * /collections:
 *   patch:
 *     summary: Cập nhật tất cả bộ sưu tập
 *     tags: [Collections]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - items
 *               - type
 *             properties:
 *               name:
 *                 type: string
 *                 description: Tên bộ sưu tập
 *                 example: "Bộ sưu tập mùa hè"
 *     responses:
 *       200:
 *         description: Cập nhật thành công tất cả bộ sưu tập
 */
Router.patch('/', CollectionController.updateAllCollections);

/**
 * @swagger
 * /collections/{id}:
 *   delete:
 *     summary: Xóa một bộ sưu tập theo ID
 *     tags: [Collections]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Bộ sưu tập đã được xóa thành công
 *       404:
 *         description: Không tìm thấy bộ sưu tập
 */
Router.delete('/:id', CollectionController.deleteCollectionById);

/**
 * @swagger
 * /collections/{id}/item:
 *   post:
 *     summary: Thêm item vào bộ sưu tập
 *     tags: [Collections]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của bộ sưu tập
 *       - in: query
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của item cần thêm
 *     responses:
 *       201:
 *         description: Thêm thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 */
Router.post('/:id/item', CollectionController.addNewItemCollection);

/**
 * @swagger
 * /collections/{id}/item:
 *   patch:
 *     summary: Xóa item bộ sưu tập
 *     tags: [Collections]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của bộ sưu tập
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               itemId:
 *                 type: string
 *                 description: ID của item cần xóa
 *             required:
 *               - itemId
 *     responses:
 *       201:
 *         description: Thêm thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 */
Router.patch('/:id/item', CollectionController.deleteItemCollection);

/**
 * @swagger
 * /collections/{id}/article:
 *   get:
 *     summary: Lấy danh sách bài viết trong bộ sưu tập
 *     tags: [Collections]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của bộ sưu tập cần lấy
 *     responses:
 *       200:
 *         description: Trả về danh sách bài viết trong bộ sưu tập
 *       404:
 *         description: Không tìm thấy bộ sưu tập
 */
Router.get('/:id/article', CollectionController.getAllArticlebyId);

/**
 * @swagger
 * /collections/item/change:
 *   patch:
 *     summary: Thay đổi bộ sưu tập
 *     tags: [Collections]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currCollectionId
 *               - newCollectionId
 *               - itemId
 *             properties:
 *               currCollectionId:
 *                 type: string
 *                 description: ID của bộ sưu tập hiện tại
 *                 example: "67bff03df22cc28360650c9e"
 *               newCollectionId:
 *                 type: string
 *                 description: ID của bộ sưu tập mới
 *                 example: "67bff074f22cc28360650ca6"
 *               itemId:
 *                 type: string
 *                 description: ID của item cần di chuyển
 *                 example: "67bfde39b6d57274a09de3d6"
 *     responses:
 *       201:
 *         description: Bộ sưu tập được tạo thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 */
Router.patch('/item/change', CollectionController.changeCollections);

export const collectiondRoute = Router;
