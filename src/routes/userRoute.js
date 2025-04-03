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
 * /users/{id}/setting:
 *   patch:
 *     summary: Cập nhật setting của người dùng
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của người dùng cần cập nhật setting
 *     responses:
 *       200:
 *         description: Cập nhật setting thành công
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
 *                   example: { "profileVisibility": true, "allowMessagesFromStrangers": false }
 *                 message:
 *                   type: string
 *                   example: "Cập nhật setting thành công"
 *       400:
 *         description: ID không hợp lệ hoặc dữ liệu setting không hợp lệ
 *       404:
 *         description: Người dùng không tồn tại
 *       500:
 *         description: Lỗi máy chủ
 */
Router.patch('/:id/setting', userController.updateUserSetting);
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


/**
 * @swagger
 * /users/{id}/created-pages:
 *   get:
 *     summary: Lấy danh sách các Page do người dùng tạo
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của người dùng
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 5
 *         description: Số lượng Page tối đa trả về trên mỗi trang
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Số lượng Page bỏ qua (dùng cho phân trang)
 *     responses:
 *       200:
 *         description: Danh sách các Page do người dùng tạo
 *       404:
 *         description: Người dùng không tồn tại
 *       500:
 *         description: Lỗi server
 */
Router.get('/:id/created-pages', userController.getCreatedPages);

/**
 * @swagger
 * /users/{id}/add-saved-location:
 *   patch:
 *     summary: Thêm địa điểm lưu trên bản đồ
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               displayName:
 *                 type: string
 *                 description: Tên hiển thị của địa điểm
 *                 example: "Hồ Gươm"
 *               placeId:
 *                 type: string
 *                 description: ID của địa điểm trên Google Maps
 *                 example: "ChIJy3mhDWBdNTERZyOqrwR7wAQ"
 *               latitude:
 *                 type: string
 *                 description: Vĩ độ
 *                 example: "21.0285"
 *               longitude:
 *                 type: string
 *                 description: Kinh độ
 *                 example: "105.8542"
 *               address:
 *                 type: string
 *                 description: Địa chỉ đầy đủ của địa điểm
 *                 example: "Đinh Tiên Hoàng, Hoàn Kiếm, Hà Nội"
 *     responses:
 *       200:
 *         description: Địa điểm đã được thêm vào danh sách lưu của user
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       404:
 *         description: Không tìm thấy người dùng
 *       500:
 *         description: Lỗi hệ thống
 */
Router.patch("/:id/add-saved-location", userController.addSavedLocation);

/**
 * @swagger
 * /users/{id}/delete-saved-location:
 *   delete:
 *     summary: Xóa địa điểm lưu trên bản đồ
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của user
 *       - in: query
 *         name: savedId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của địa điểm cần xóa khỏi danh sách lưu
 *     responses:
 *       200:
 *         description: Địa điểm đã được xóa khỏi danh sách lưu của user
 *       400:
 *         description: Dữ liệu không hợp lệ hoặc không tìm thấy địa điểm
 *       404:
 *         description: Không tìm thấy người dùng
 *       500:
 *         description: Lỗi hệ thống
 */
Router.delete("/:id/delete-saved-location", userController.deleteSavedLocation);

/**
 * @swagger
 * /users/{id}/saved-locations:
 *   get:
 *     summary: Lấy danh sách địa điểm đã lưu của người dùng
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của user
 *     responses:
 *       200:
 *         description: Trả về danh sách địa điểm đã lưu
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 savedLocations:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "65f9b4e8c9d3b7a1e45d2b6e"
 *                       displayName:
 *                         type: string
 *                         example: "Hồ Gươm"
 *                       placeId:
 *                         type: string
 *                         example: "ChIJy3mhDWBdNTERZyOqrwR7wAQ"
 *                       latitude:
 *                         type: string
 *                         example: "21.0285"
 *                       longitude:
 *                         type: string
 *                         example: "105.8542"
 *                       address:
 *                         type: string
 *                         example: "Đinh Tiên Hoàng, Hoàn Kiếm, Hà Nội"
 *       404:
 *         description: Không tìm thấy người dùng
 *       500:
 *         description: Lỗi hệ thống
 */

Router.get("/:id/saved-locations", userController.getAllSavedLocation);

export const userRoute = Router;
