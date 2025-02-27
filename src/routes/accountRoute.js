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
/**
 * @swagger
 * /accounts/login:
 *   post:
 *     summary: Đăng nhập vào hệ thống
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
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "yourpassword"
 *     responses:
 *       200:
 *         description: Đăng nhập thành công, trả về token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       example: "eyJhbGciOiJIUzI1NiIsInR..."
 *                     account:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: "60f7ebeb2f8fb814b56fa181"
 *                         email:
 *                           type: string
 *                           example: "user@example.com"
 *                         role:
 *                           type: string
 *                           example: "user"
 *       400:
 *         description: Thiếu email hoặc mật khẩu
 *       401:
 *         description: Email hoặc mật khẩu không đúng
 */
Router.post('/login', accountController.loginAccount);
/**
 * @swagger
 * /accounts/sendOtp:
 *   post:
 *     summary: Gửi mã OTP đến email hoặc số điện thoại
 *     tags: [Accounts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               input:
 *                 type: string
 *                 example: "user@example.com hoặc 0123456789"

 *     responses:
 *       200:
 *         description: Mã OTP đã được gửi thành công
 *       400:
 *         description: Dữ liệu đầu vào không hợp lệ
 *       404:
 *         description: Không tìm thấy email hoặc số điện thoại
 */
Router.post('/sendOtp', accountController.sendOtp);
/**
 * @swagger
 * /accounts/verifyOtp:
 *   post:
 *     summary: Xác minh mã OTP
 *     tags: [Accounts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               input:
 *                 type: string
 *                 description: Email của người dùng đã nhận OTP
 *                 example: "user@example.com"
 *               otp:
 *                 type: string
 *                 description: Mã OTP được gửi qua email
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Xác minh OTP thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Xác minh OTP thành công!"
 *       400:
 *         description: Dữ liệu đầu vào không hợp lệ hoặc OTP sai
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Mã OTP không chính xác."
 *       404:
 *         description: OTP hết hạn hoặc không tồn tại
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "OTP đã hết hạn hoặc không tồn tại."
 */
Router.post("/verifyOtp", accountController.verifyOtp);
/**
 * @swagger
 * /accounts/updatePassword:
 *   post:
 *     summary: Cập nhật mật khẩu mới
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
 *                 description: Email của tài khoản cần đổi mật khẩu
 *                 example: "user@example.com"
 *               newPassword:
 *                 type: string
 *                 description: Mật khẩu mới
 *                 example: "newSecurePassword123"
 *     responses:
 *       200:
 *         description: Mật khẩu đã được cập nhật thành công
 *       400:
 *         description: Dữ liệu đầu vào không hợp lệ
 *       404:
 *         description: Email không tồn tại trong hệ thống
 *       500:
 *         description: Lỗi hệ thống
 */
Router.post("/updatePassword", accountController.updatePassword);
/**
 * @swagger
 * /accounts/create:
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
 *                 description: Email đăng ký
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 description: Mật khẩu
 *                 example: "securePassword123"
 *               displayName:
 *                 type: string
 *                 description: Tên hiển thị của người dùng
 *                 example: "John Doe"
 *               hashtag:
 *                 type: string
 *                 description: Hashtag người dùng
 *                 example: "#john123"
 *     responses:
 *       201:
 *         description: Tạo tài khoản thành công
 *       400:
 *         description: Email đã tồn tại hoặc dữ liệu không hợp lệ
 *       500:
 *         description: Lỗi hệ thống
 */
Router.post("/create", accountController.createAccount);
export const accountRoute = Router;
