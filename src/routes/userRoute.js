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

/**
 * @swagger
 * /users/{id}/not-joined-groups:
 *   get:
 *     summary: Lấy danh sách nhóm mà người dùng chưa tham gia
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
 *         description: Trả về danh sách nhóm chưa tham gia
 *       404:
 *         description: Người dùng không tồn tại hoặc không có nhóm phù hợp
 *       500:
 *         description: Lỗi server
 */
Router.get("/:id/not-joined-groups", userController.getNotJoinedGroups);

/**
 * @swagger
 * /users/{id}/group-articles:
 *   get:
 *     summary: Lấy tất cả bài viết đã duyệt từ các nhóm mà người dùng tham gia
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
 *         description: Trả về danh sách các bài viết đã duyệt trong các nhóm mà người dùng tham gia
 *       404:
 *         description: Người dùng không tồn tại hoặc không có bài viết nào
 *       500:
 *         description: Lỗi server
 */
Router.get("/:id/group-articles", userController.getArticleAllGroups);

/**
 * @swagger
 * /users/{id}/avt:
 *   get:
 *     summary: Lấy ảnh đại diện
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của người dùng
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [img, video, record]
 *         required: false
 *         description: Lọc theo loại nội dung (img, video, record)
 *     responses:
 *       200:
 *         description: Lấy ảnh đại diện
 */
Router.get('/:id/avt', userController.getPhotoAvt);

/**
 * @swagger
 * /users/addHobbyByEmail:
 *   post:
 *     summary: Thêm sở thích vào user bằng email
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email của user
 *                 example: "user@example.com"
 *               hobbies:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Danh sách sở thích
 *                 example: ["Bóng đá", "Nấu ăn"]
 *     responses:
 *       200:
 *         description: Thêm sở thích thành công
 *       400:
 *         description: Dữ liệu không hợp lệ hoặc sở thích đã tồn tại
 *       404:
 *         description: Người dùng không tồn tại
 *       500:
 *         description: Lỗi hệ thống
 */
Router.post("/addHobbyByEmail", userController.addHobbyByEmail);
/**
 * @swagger
 * /users/collections:
 *   post:
 *     summary: Tạo collection mới cho user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "60f7ebeb2f8fb814b56fa181"
 *               name:
 *                 type: string
 *                 example: "Bộ sưu tập ảnh"
 *               type:
 *                 type: string
 *                 enum: ["article", "reels"]
 *                 example: "article"
 *     responses:
 *       200:
 *         description: Tạo collection cho user thành công
 */
Router.post('/collections', userController.createCollection);

/**
 * @swagger
 * /users/{id}/collections:
 *   delete:
 *     summary: Xóa bộ sưu tập của người dùng
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "60f7ebeb2f8fb814b56fa181"
 *         description: ID của người dùng
 *       - in: query
 *         name: collectionId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của bộ sưu tập cần xóa
 *     responses:
 *       200:
 *         description: Xóa bộ sưu tập thành công
 *       400:
 *         description: Dữ liệu đầu vào không hợp lệ
 *       500:
 *         description: Lỗi server khi xóa bộ sưu tập
 */
Router.delete('/:id/collections', userController.deleteCollection);

/**
 * @swagger
 * /users/{id}/collections-recent:
 *   get:
 *     summary: Lấy danh sách bài viết gần đây
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "60f7ebeb2f8fb814b56fa181"
 *         description: ID của người dùng
 *       - in: query
 *         name: limit
 *         required: true
 *         schema:
 *           type: number
 *         description: Số lượng cần lấy
 *     responses:
 *       200:
 *         description: Lấy thành công
 *       400:
 *         description: Dữ liệu đầu vào không hợp lệ
 *       500:
 *         description: Lỗi server khi xóa bộ sưu tập
 */
Router.get('/:id/collections-recent', userController.getEarliestItems);

/**
 * @swagger
 * /users/{id}/collections:
 *   get:
 *     summary: Lấy danh sách tất cả bộ sưu tập
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "60f7ebeb2f8fb814b56fa181"
 *         description: ID của người dùng
 *     responses:
 *       200:
 *         description: Lấy thành công
 *       400:
 *         description: Dữ liệu đầu vào không hợp lệ
 *       500:
 *         description: Lỗi server khi xóa bộ sưu tập
 */
Router.get('/:id/collections', userController.getAllCollection);

/**
 * @swagger
 * /users/{id}/friends:
 *   get:
 *     summary: Lấy danh sách bạn bè
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "60f7ebeb2f8fb814b56fa181"
 *         description: ID của người dùng
 *     responses:
 *       200:
 *         description: Lấy thành công
 *       400:
 *         description: Dữ liệu đầu vào không hợp lệ
 *       500:
 *         description: Lỗi server khi xóa bộ sưu tập
 */
Router.get('/:id/friends', userController.getAllFriends);

/**
 * @swagger
 * /users/{id}/unfriend:
 *   patch:
 *     summary: Hủy kết bạn
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "60f7ebeb2f8fb814b56fa181"
 *         description: ID của người dùng
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               friendId:
 *                 type: string
 *                 example: "60f7ebeb2f8fb814b56fa181"
 *     responses:
 *       200:
 *         description: Lấy thành công
 *       400:
 *         description: Dữ liệu đầu vào không hợp lệ
 *       500:
 *         description: Lỗi server khi xóa bộ sưu tập
 */
Router.patch('/:id/unfriend', userController.unFriends);

/**
 * @swagger
 * /users/{id}/suggest:
 *   get:
 *     summary: Lấy danh sách gợi ý bạn bè
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "60f7ebeb2f8fb814b56fa181"
 *         description: ID của người dùng
 *     responses:
 *       200:
 *         description: Lấy thành công
 *       400:
 *         description: Dữ liệu đầu vào không hợp lệ
 *       500:
 *         description: Lỗi server khi xóa bộ sưu tập
 */
Router.get('/:id/suggest', userController.suggestedFriends);

export const userRoute = Router;
