import Comment from "../models/Comment.js";

const getComments = async () => {
  return await Comment.find({ _destroy: null })
};

const getCommentById = async (id) => {
  return await Comment.findOne({ _id: id, _destroy: null })
};

const createComment = async (data) => {
  return await Comment.create(data);
};

const updateCommentById = async (id, data) => {
  return await Comment.findByIdAndUpdate(id, data, { new: true })
};

const updateAllComments = async (data) => {
  return await Comment.updateMany({}, data, { new: true });
};

const deleteCommentById = async (id) => {
  return await Comment.findByIdAndUpdate(id, { _destroy: Date.now() }, { new: true });
};

export const commentService = {
  getComments,
  getCommentById,
  createComment,
  updateCommentById,
  updateAllComments,
  deleteCommentById,
};
