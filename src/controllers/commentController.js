import { commentService } from '../services/commentService.js';

const getComments = async (req, res) => {
  try {
    const comments = await commentService.getComments();
    res.status(200).json({ success: true, data: comments, message: 'Lấy danh sách bình luận thành công' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

const getCommentById = async (req, res) => {
  try {
    const comment = await commentService.getCommentById(req.params.id);
    if (!comment) return res.status(404).json({ success: false, data: null, message: 'Bình luận không tồn tại' });
    res.status(200).json({ success: true, data: comment, message: 'Lấy bình luận thành công' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

const createComment = async (req, res) => {
  try {
    const newComment = await commentService.createComment(req.body);
    res.status(201).json({ success: true, data: newComment, message: 'Tạo bình luận thành công' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

const updateCommentById = async (req, res) => {
  try {
    const updatedComment = await commentService.updateCommentById(req.params.id, req.body);
    if (!updatedComment) return res.status(404).json({ success: false, data: null, message: 'Bình luận không tồn tại' });
    res.status(200).json({ success: true, data: updatedComment, message: 'Cập nhật bình luận thành công' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

const updateAllComments = async (req, res) => {
  try {
    const updatedComments = await commentService.updateAllComments(req.body);
    res.status(200).json({ success: true, data: updatedComments, message: 'Cập nhật tất cả bình luận thành công' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

const deleteCommentById = async (req, res) => {
  try {
    const deletedComment = await commentService.deleteCommentById(req.params.id);
    if (!deletedComment) return res.status(404).json({ success: false, data: null, message: 'Bình luận không tồn tại' });
    res.status(200).json({ success: true, data: null, message: 'Xóa bình luận thành công' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

export const commentController = {
  getComments,
  getCommentById,
  createComment,
  updateCommentById,
  updateAllComments,
  deleteCommentById,
};
