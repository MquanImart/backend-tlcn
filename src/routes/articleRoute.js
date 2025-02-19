import express from 'express';
import { articleController } from '../controllers/articleController.js';

const Router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Articles
 *   description: API quản lý bài viết
 */


/**
 * @swagger
 * /articles:
 *   get:
 *     summary: Lấy danh sách bài viết
 *     tags: [Articles]
 *     parameters:
 *       - in: query
 *         name: createdBy
 *         schema:
 *           type: string
 *         description: ID người tạo bài viết (lọc theo người tạo)
 *       - in: query
 *         name: groupID
 *         schema:
 *           type: string
 *         description: ID nhóm (lọc theo nhóm)
 *     responses:
 *       200:
 *         description: Trả về danh sách bài viết
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Article'
 */
Router.get('/', articleController.getArticles);

/**
 * @swagger
 * /articles/{id}:
 *   get:
 *     summary: Lấy bài viết theo ID
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của bài viết cần lấy
 *     responses:
 *       200:
 *         description: Trả về bài viết
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Article'
 *       404:
 *         description: Không tìm thấy bài viết
 */
Router.get('/:id', articleController.getArticleById);

/**
 * @swagger
 * /articles:
 *   post:
 *     summary: Tạo bài viết mới
 *     tags: [Articles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Article'
 *     responses:
 *       201:
 *         description: Tạo bài viết thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Article'
 *       400:
 *         description: Thiếu dữ liệu bắt buộc
 */
Router.post('/', articleController.createArticle);

/**
 * @swagger
 * /articles/{id}:
 *   patch:
 *     summary: Cập nhật bài viết theo ID
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của bài viết cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 example: "Nội dung mới của bài viết"
 *               scope:
 *                 type: string
 *                 example: "private"
 *     responses:
 *       200:
 *         description: Cập nhật bài viết thành công
 *       404:
 *         description: Không tìm thấy bài viết
 */
Router.patch('/:id', articleController.updateArticleById);

/**
 * @swagger
 * /articles:
 *   patch:
 *     summary: Cập nhật tất cả bài viết
 *     tags: [Articles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               scope:
 *                 type: string
 *                 example: "public"
 *     responses:
 *       200:
 *         description: Cập nhật tất cả bài viết thành công
 */
Router.patch('/', articleController.updateAllArticles);

/**
 * @swagger
 * /articles/{id}:
 *   delete:
 *     summary: Xóa bài viết theo ID (Soft Delete)
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của bài viết cần xóa
 *     responses:
 *       200:
 *         description: Xóa bài viết thành công
 *       404:
 *         description: Không tìm thấy bài viết
 */
Router.delete('/:id', articleController.deleteArticleById);

/**
* @swagger
* /articles/{articleId}/like:
*   patch:
*     summary: Like hoặc bỏ like bài viết
*     tags: [Articles]
*     parameters:
*       - in: path
*         name: articleId
*         required: true
*         schema:
*           type: string
*         description: ID bài viết cần like/unlike
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               userId:
*                 type: string
*                 description: ID người dùng thực hiện thao tác like/unlike
*     responses:
*       200:
*         description: Thao tác like/unlike thành công
*       400:
*         description: userId là bắt buộc
*       404:
*         description: Bài viết không tồn tại
 */
Router.patch('/:articleId/like', articleController.toggleLike);



/**
 * @swagger
 * /articles/{articleId}/comments:
 *   get:
 *     summary: Lấy tất cả bình luận của bài viết theo ID bài viết (bao gồm tất cả bình luận con)
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: articleId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của bài viết cần lấy bình luận
 *     responses:
 *       200:
 *         description: Trả về danh sách bình luận của bài viết, bao gồm bình luận con
 */
Router.get("/:articleId/comments", articleController.getCommentsByArticleId);

export const articleRoute = Router;
