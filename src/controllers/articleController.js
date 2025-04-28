import { articleService } from '../services/articleService.js';

const getArticles = async (req, res) => {
  try {
    const articles = await articleService.getArticles();
    res.status(200).json({ success: true, data: articles, message: 'Lấy danh sách bài viết thành công' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

const getArticleById = async (req, res) => {
  try {
    const article = await articleService.getArticleById(req.params.id);
    if (!article) return res.status(404).json({ success: false, data: null, message: 'Bài viết không tồn tại' });
    res.status(200).json({ success: true, data: article, message: 'Lấy bài viết thành công' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

const createArticle = async (req, res) => {
  try {

    const newArticle = await articleService.createArticle(req.body, req.files);

    res.status(201).json({
      success: true,
      data: newArticle,
      message: "Tạo bài viết thành công",
    });
  } catch (error) {
    console.error("❌ Lỗi khi tạo bài viết:", error);
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};



const updateArticleById = async (req, res) => {
  try {
    const updatedArticle = await articleService.updateArticleById(req.params.id, req.body);
    if (!updatedArticle) return res.status(404).json({ success: false, data: null, message: 'Bài viết không tồn tại' });
    res.status(200).json({ success: true, data: updatedArticle, message: 'Cập nhật bài viết thành công' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

const updateAllArticles = async (req, res) => {
  try {
    const updatedArticles = await articleService.updateAllArticles(req.body);
    res.status(200).json({ success: true, data: updatedArticles, message: 'Cập nhật tất cả bài viết thành công' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

const deleteArticleById = async (req, res) => {
  try {
    const deletedArticle = await articleService.deleteArticleById(req.params.id);
    if (!deletedArticle) return res.status(404).json({ success: false, data: null, message: 'Bài viết không tồn tại' });
    res.status(200).json({ success: true, data: null, message: 'Xóa bài viết thành công' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

const toggleLike = async (req, res) => {
  try {
    const { articleId } = req.params;
    const { userId } = req.body; 
  
    if (!userId) {  
      return res.status(400).json({
        success: false,
        data: null, 
        message: 'userId là bắt buộc',
      });
    }

    const updatedArticle = await articleService.toggleLike(articleId, userId);

    res.status(200).json({
      success: true,
      data: updatedArticle,
      message: 'Thao tác like/unlike thành công',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: null,
      message: error.message,
    });
  }
};


const getCommentsByArticleId = async (req, res) => {
  try {
    const { articleId } = req.params;
    const comments = await articleService.getCommentsByArticleId(articleId);

    res.status(200).json({
      success: true,
      data: comments,
      message: "Lấy danh sách bình luận thành công",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: null,
      message: error.message,
    });
  }
};


export const articleController = {
  getArticles,
  getArticleById,
  createArticle,
  updateArticleById,
  updateAllArticles,
  deleteArticleById,
  toggleLike,
  getCommentsByArticleId
};
