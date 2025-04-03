import Comment from "../models/Comment.js";
import { articleService } from "./articleService.js";
import reelsService from "./reelsService.js";
import { myPhotoService } from "./myPhotoService.js";

const getComments = async () => {
  return await Comment.find({ _destroy: null })
    .populate({
      path: "_iduser",
      select: "displayName avt",
      populate: { path: "avt", select: "url" },
    })
    .populate({
      path: "replyComment",
      populate: {
        path: "_iduser",
        select: "displayName avt",
        populate: { path: "avt", select: "url" },
      },
    })
    .populate({
      path: "img", // Populate trường img
      select: "url type", // Chỉ lấy url và type từ MyPhoto
    });
};

const getCommentById = async (id) => {
  return await Comment.findOne({ _id: id, _destroy: null })
  .populate({
    path: "_iduser",
    select: "displayName avt",
    populate: { path: "avt", select: "url" },
  })
  .populate({
    path: "replyComment",
    populate: {
      path: "_iduser",
      select: "displayName avt",
      populate: { path: "avt", select: "url" },
    },
  })
  .populate({
    path: "img", 
    select: "url type", 
  });
};

const createComment = async (data, files) => {
  const { _iduser, content, img, articleId, replyComment } = data;

  // Kiểm tra số lượng file
  const allFiles = [...(files?.media || []), ...(files?.images || [])];
  if (allFiles.length > 1) {
    throw new Error("Chỉ được phép đính kèm tối đa 1 ảnh hoặc video cho mỗi bình luận");
  }
  const newCommentData = {
    _iduser,
    content,
    img: img || [], 
  };

  let newComment;

  // 🔥 2️⃣ Tạo bình luận trước để có _id
  if (articleId && !replyComment) {
    const article = await articleService.getArticleById(articleId);
    if (article) {
      newComment = await Comment.create(newCommentData);
      article.comments.push(newComment._id);
      await article.save();
    } else {
      const reel = await reelsService.getReelById(articleId);
      if (!reel) {
        throw new Error("Bài viết hoặc reel không tồn tại");
      }
      newComment = await Comment.create(newCommentData);
      reel.comments.push(newComment._id);
      await reel.save();
    }
  } else if (replyComment && !articleId) {
    const parentComment = await Comment.findById(replyComment);
    if (!parentComment) {
      throw new Error("Bình luận cha không tồn tại");
    }
    newComment = await Comment.create(newCommentData);
    parentComment.replyComment.push(newComment._id);
    await parentComment.save();
  } else {
    throw new Error("Cần có `articleId` hoặc `replyComment` để tạo bình luận");
  }

  // 🔥 3️⃣ Upload file với referenceId là _id của comment vừa tạo
  let uploadedMedia = [];
  if (allFiles.length > 0) {
    const file = allFiles[0]; // Chỉ lấy file đầu tiên
    const fileType = file.mimetype.startsWith("video/") ? "video" : "img";
    const uploadedFile = await myPhotoService.uploadAndSaveFile(
      file,
      _iduser,
      fileType,
      "comments",
      newComment._id // Truyền _id của comment làm referenceId
    );
    uploadedMedia = [uploadedFile]; // Chỉ lưu 1 file

    // 🔥 4️⃣ Cập nhật lại trường img của comment với ID của ảnh/video
    newComment.img = uploadedMedia.map((media) => media._id);
    await newComment.save();
  }

  return newComment;
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
