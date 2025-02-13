import express from 'express';
import { accountController } from '../controllers/accountController.js';

const Router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Accounts
 */

/**
 * @swagger
 * /accounts:
 *   get:
 *     summary: Lấy danh sách tài khoản
 *     tags: [Accounts]
 *     responses:
 *       200:
 *         description: Trả về danh sách tài khoản
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "60f7ebeb2f8fb814b56fa181"
 *                   email:
 *                     type: string
 *                     example: "user@example.com"
 *                   phone:
 *                     type: string
 *                     example: "0123456789"
 *                   role:
 *                     type: string
 *                     example: "user"
 */
Router.get('/', accountController.getAccounts);
/**
 * @swagger
 * /accounts/{id}:
 *   get:
 *     summary: Lấy thông tin tài khoản theo ID
 *     tags: [Accounts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của tài khoản cần lấy
 *     responses:
 *       200:
 *         description: Thông tin tài khoản
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "60f7ebeb2f8fb814b56fa181"
 *                 email:
 *                   type: string
 *                   example: "user@example.com"
 *                 phone:
 *                   type: string
 *                   example: "0123456789"
 *                 role:
 *                   type: string
 *                   example: "user"
 *       404:
 *         description: Không tìm thấy tài khoản
 */
Router.get('/:id', accountController.getAccountById);

/**
 * @swagger
 * /accounts:
 *   post:
 *     summary: Tạo tài khoản mới
 *     tags: [Accounts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "newuser@example.com"
 *               phone:
 *                 type: string
 *                 example: "0987654321"
 *               password:
 *                 type: string
 *                 example: "securepassword"
 *               role:
 *                 type: string
 *                 example: "user"
 *     responses:
 *       201:
 *         description: Tài khoản được tạo thành công
 *       400:
 *         description: Dữ liệu đầu vào không hợp lệ
 */
Router.post('/', accountController.createAccount);

/**
 * @swagger
 * /accounts/{id}:
 *   patch:
 *     summary: Cập nhật một tài khoản theo ID
 *     tags: [Accounts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của tài khoản cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "updateduser@example.com"
 *               phone:
 *                 type: string
 *                 example: "0111222333"
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       404:
 *         description: Không tìm thấy tài khoản
 */
Router.patch('/:id', accountController.updateAccountById);

/**
 * @swagger
 * /accounts:
 *   patch:
 *     summary: Cập nhật tất cả tài khoản
 *     tags: [Accounts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               role: "admin"
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
Router.patch('/', accountController.updateAllAccounts);

/**
 * @swagger
 * /accounts/{id}:
 *   delete:
 *     summary: Xóa tài khoản theo ID
 *     tags: [Accounts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của tài khoản cần xóa
 *     responses:
 *       200:
 *         description: Xóa tài khoản thành công
 *       404:
 *         description: Không tìm thấy tài khoản
 */
Router.delete('/:id', accountController.deleteAccountById);

export const accountRoute = Router;
