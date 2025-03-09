import Article from "../models/Article.js";
import Comment from "../models/Comment.js";
import Group from "../models/Group.js";
import User from "../models/User.js";
import { myPhotoService } from "./myPhotoService.js";

const getArticles = async () => {
  return await Article.find({ _destroy: null })
    .populate({
      path: 'createdBy',
      select: '_id displayName avt ',
      populate: {
        path: 'avt',
        select: '_id name idAuthor type url createdAt updatedAt',
      },
    })
    .populate({
      path: 'listPhoto',
      select: '_id name idAuthor type url createdAt updatedAt',
      populate: {
        path: 'idAuthor',
        select: '_id displayName avt',
      },
    })
    .populate({
      path: 'groupID',
      select: '_id groupName ',
    })
    .populate({
      path: 'address',
      select: '_id province district ward street placeName lat long',
    })
    .sort({ createdAt: -1 });
};


const getArticleById = async (id) => {
  return await Article.findOne({ _id: id, _destroy: null })
  .populate({
    path: 'createdBy',
    select: '_id displayName avt ',
    populate: {
      path: 'avt',
      select: '_id name idAuthor type url createdAt updatedAt',
    },
  })
  .populate({
    path: 'listPhoto',
    select: '_id name idAuthor type url createdAt updatedAt',
    populate: {
      path: 'idAuthor',
      select: '_id displayName avt',
    },
  })
  .populate({
    path: 'groupID',
    select: '_id groupName ',
  })
  .populate({
    path: 'address',
    select: '_id province district ward street placeName lat long',
  })
  .sort({ createdAt: -1 });
};

const createArticle = async (data, files) => {
  try {
    const { createdBy, content, hashTag, scope, groupID } = data;

    if (!createdBy || !content) {
      throw new Error("❌ Thiếu thông tin bắt buộc"); 
    }

    const normalizedHashtags = Array.isArray(hashTag) 
      ? hashTag 
      : hashTag.split(",").map(tag => tag.trim());

    // 🔥 1️⃣ Tạo bài viết mới (chưa có media)
    const newArticle = await Article.create({
      createdBy,
      content,
      hashTag: normalizedHashtags,
      scope,
      groupID: groupID || null,
      listPhoto: [],
    });

    let uploadedMedia = [];
    if (files && (files.media || files.images)) {
      const allFiles = [...(files.media || []), ...(files.images || [])];

      uploadedMedia = await Promise.all(
        allFiles.map((file) => {
          const fileType = file.mimetype.startsWith("video/") ? "video" : "img";
          return myPhotoService.uploadAndSaveFile(file, createdBy, fileType, "articles", newArticle._id);
        })
      );
    }
    if (uploadedMedia.length > 0) {
      newArticle.listPhoto = uploadedMedia.map((media) => media._id);
      await newArticle.save();
    }

    if (groupID) {
      await Group.findByIdAndUpdate(
        groupID,
        { $push: { article: { idArticle: newArticle._id, state: "pending" } } },
        { new: true }
      );
    } else {
      await User.findByIdAndUpdate(
        createdBy,
        { $push: { articles: newArticle._id } },
        { new: true }
      );
    }
    return newArticle;
  } catch (error) {
    throw error;
  }
};

const updateArticleById = async (id, data) => {
  return await Article.findByIdAndUpdate(id, data, { new: true, useFindAndModify: false });
};

const updateAllArticles = async (data) => {
  return await Article.updateMany({}, data, { new: true });
};

const deleteArticleById = async (id) => {
  return await Article.findByIdAndUpdate(id, { _destroy: Date.now() }, { new: true });
};

const toggleLike = async (articleId, userId) => {
  const article = await Article.findById(articleId);

  if (!article) {
    throw new Error('Bài viết không tồn tại');
  }

  const liked = article.emoticons.includes(userId);

  if (liked) {
    article.emoticons = article.emoticons.filter(id => id.toString() !== userId.toString());
  } else {
    article.emoticons.push(userId);
  }

  await article.save();

  return article;
};


const deepPopulateComments = async (comments) => {
  // Nếu không có bình luận nào, trả về ngay lập tức
  if (!comments || comments.length === 0) return comments;

  // Dùng phương thức populate để lấy bình luận con cho từng bình luận
  const populatedComments = await Comment.populate(comments, {
    path: "replyComment",
    match: { _destroy: null }, // Lọc các bình luận không bị xóa
    populate: [
      {
        path: "_iduser",  // Populate thông tin người dùng cho từng bình luận
        select: "displayName avt",
        populate: { 
          path: "avt",  // Populate URL avatar cho người dùng
          select: "url" 
        },
      },
      {
        path: "replyComment",  // Tiếp tục đệ quy populate các bình luận con
        match: { _destroy: null },
        populate: [
          {
            path: "_iduser",
            select: "displayName avt",
            populate: { path: "avt", select: "url" },
          },
        ],
      },
    ],
  });

  // Duyệt qua các bình luận và kiểm tra xem có bình luận con nào không để tiếp tục đệ quy
  for (let comment of populatedComments) {
    if (comment.replyComment && comment.replyComment.length > 0) {
      comment.replyComment = await deepPopulateComments(comment.replyComment);
    }
  }

  return populatedComments;
};

const getCommentsByArticleId = async (articleId) => {
  const article = await Article.findById(articleId)
    .populate({
      path: "comments",
      match: { _destroy: null },
      populate: [
        {
          path: "_iduser",
          select: "displayName avt",
          populate: { path: "avt", select: "url" },
        },
        {
          path: "replyComment",
          match: { _destroy: null },
        },
      ],
    })
    .select("comments");

  if (!article || !article.comments) return [];

  let comments = article.comments;

  // Gọi hàm đệ quy để lấy tất cả bình luận con
  comments = await deepPopulateComments(comments);

  return comments;
};


export const articleService = {
  getArticles,
  getArticleById,
  createArticle,
  updateArticleById,
  updateAllArticles,
  deleteArticleById,
  toggleLike,
  getCommentsByArticleId
};
