import express from 'express';
import { userController } from '../controllers/userController.js';

const Router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Lấy danh sách người dùng
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Trả về danh sách người dùng
 */
Router.get('/', userController.getUsers);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Lấy người dùng theo ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của người dùng cần lấy
 *     responses:
 *       200:
 *         description: Trả về người dùng
 */
Router.get('/:id', userController.getUserById);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Tạo người dùng mới
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               displayName:
 *                 type: string
 *                 example: "Nguyễn Văn A"
 *               account:
 *                 type: string
 *                 example: "60f7ebeb2f8fb814b56fa181"
 *               identification:
 *                 type: string
 *                 example: "60f7ebeb2f8fb814b56fa182"
 *               address:
 *                 type: string
 *                 example: "60f7ebeb2f8fb814b56fa183"
 *     responses:
 *       201:
 *         description: Tạo người dùng thành công
 */
Router.post('/', userController.createUser);

/**
 * @swagger
 * /users/{id}:
 *   patch:
 *     summary: Cập nhật người dùng theo ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của người dùng cần cập nhật
 *     responses:
 *       200:
 *         description: Cập nhật người dùng thành công
 */
Router.patch('/:id', userController.updateUserById);

/**
 * @swagger
 * /users:
 *   patch:
 *     summary: Cập nhật tất cả người dùng
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Cập nhật tất cả người dùng thành công
 */
Router.patch('/', userController.updateAllUsers);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Xóa người dùng theo ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của người dùng cần xóa
 *     responses:
 *       200:
 *         description: Xóa người dùng thành công
 */
Router.delete('/:id', userController.deleteUserById);

/**
 * @swagger
 * /users/{id}/saved-groups:
 *   get:
 *     summary: Lấy danh sách nhóm mà người dùng đã lưu
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của người dùng
 *     responses:
 *       200:
 *         description: Trả về danh sách nhóm đã lưu
 *       404:
 *         description: Người dùng không tồn tại hoặc chưa lưu nhóm nào
 *       500:
 *         description: Lỗi server
 */
Router.get("/:id/saved-groups", userController.getSavedGroups);

/**
 * @swagger
 * /users/{id}/my-groups:
 *   get:
 *     summary: Lấy danh sách nhóm mà người đó tạo
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của người dùng
 *     responses:
 *       200:
 *         description: Trả về danh sách nhóm đã lưu
 *       404:
 *         description: Người dùng không tồn tại hoặc chưa lưu nhóm nào
 *       500:
 *         description: Lỗi server
 */
Router.get("/:id/my-groups", userController.getMyGroups);

export const userRoute = Router;
