import express from 'express';
import ProvinceController from '../controllers/provinceController.js';

const Router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Provinces
 *   description: API quản lý tỉnh/thành phố
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Province:
 *       type: object
 *       required:
 *         - name
 *         - avt
 *       properties:
 *         name:
 *           type: string
 *           description: Tên tỉnh/thành phố
 *           example: "Hà Nội"
 *         avt:
 *           type: string
 *           description: Ảnh đại diện của tỉnh/thành phố (URL)
 *           example: "https://example.com/image.jpg"
 *         listPage:
 *           type: array
 *           description: Danh sách các trang liên quan đến tỉnh/thành phố
 *           items:
 *             type: string
 *           example: ["page1", "page2"]
 */

/**
 * @swagger
 * /province:
 *   get:
 *     summary: Lấy danh sách tất cả các tỉnh/thành phố
 *     tags: [Provinces]
 *     responses:
 *       200:
 *         description: Danh sách các tỉnh/thành phố
 */
Router.get('/', ProvinceController.getProvinces);

/**
 * @swagger
 * /province/{id}:
 *   get:
 *     summary: Lấy thông tin một tỉnh/thành phố theo ID
 *     tags: [Provinces]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của tỉnh/thành phố cần lấy
 *     responses:
 *       200:
 *         description: Trả về thông tin tỉnh/thành phố
 *       404:
 *         description: Không tìm thấy tỉnh/thành phố
 */
Router.get('/:id', ProvinceController.getProvinceById);

/**
 * @swagger
 * /province:
 *   post:
 *     summary: Tạo một tỉnh/thành phố mới
 *     tags: [Provinces]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Province'
 *     responses:
 *       201:
 *         description: Tỉnh/thành phố được tạo thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 */
Router.post('/', ProvinceController.createProvince);

/**
 * @swagger
 * /province/{id}:
 *   patch:
 *     summary: Cập nhật thông tin một tỉnh/thành phố theo ID
 *     tags: [Provinces]
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
 *             $ref: '#/components/schemas/Province'
 *     responses:
 *       200:
 *         description: Cập nhật thành công tỉnh/thành phố
 *       404:
 *         description: Không tìm thấy tỉnh/thành phố
 */
Router.patch('/:id', ProvinceController.updateProvinceById);

/**
 * @swagger
 * /province:
 *   patch:
 *     summary: Cập nhật tất cả tỉnh/thành phố
 *     tags: [Provinces]
 *     responses:
 *       200:
 *         description: Cập nhật thành công tất cả tỉnh/thành phố
 */
Router.patch('/', ProvinceController.updateAllProvinces);

/**
 * @swagger
 * /province/{id}:
 *   delete:
 *     summary: Xóa một tỉnh/thành phố theo ID
 *     tags: [Provinces]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tỉnh/thành phố đã được xóa thành công
 *       404:
 *         description: Không tìm thấy tỉnh/thành phố
 */
Router.delete('/:id', ProvinceController.deleteProvinceById);

export const provinceRoute = Router;
