import Article from "../models/Article.js";
import Comment from "../models/Comment.js";
import Group from "../models/Group.js";
import Page from "../models/Page.js";
import User from "../models/User.js";
import { myPhotoService } from "./myPhotoService.js";
import {addressService} from "./addressService.js";
import mongoose from 'mongoose';

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
    const { createdBy, content, hashTag, scope, groupID, pageId, address } = data;

    if (!createdBy || !content) {
      throw new Error("❌ Thiếu thông tin bắt buộc"); 
    }

    const normalizedHashtags = Array.isArray(hashTag) 
      ? hashTag 
      : hashTag.split(",").map(tag => tag.trim());

    // 🔥 1️⃣ Xử lý địa chỉ nếu có
    let addressId = null;
    if (address) {
      try {
        // Parse the address string if it's a string
        const addressData = typeof address === 'string' ? JSON.parse(address) : address;
        
        const newAddress = await addressService.createAddress({
          province: addressData.province,
          district: addressData.district,
          ward: addressData.ward,
          street: addressData.street || '', // Ensure street has a default value
          placeName: addressData.placeName || 
            `${addressData.street || ''}, ${addressData.ward}, ${addressData.district}, ${addressData.province}`.trim(),
          lat: addressData.lat,
          long: addressData.long
        });
        addressId = newAddress._id;
        console.log('📍 Đã tạo địa chỉ mới:', newAddress);
      } catch (error) {
        console.error('❌ Lỗi khi tạo địa chỉ:', error);
        // Vẫn tiếp tục tạo bài viết nếu có lỗi địa chỉ
      }
    }

    // 🔥 2️⃣ Tạo bài viết mới
    const newArticle = await Article.create({
      createdBy,
      content,
      hashTag: normalizedHashtags,
      scope,
      groupID: groupID || null,
      address: addressId,
      listPhoto: [],
    });

    // 🔥 3️⃣ Xử lý media
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

    // 🔥 4️⃣ Cập nhật group/page/user
    if (groupID) {
      await Group.findByIdAndUpdate(
        groupID,
        { $push: { article: { idArticle: newArticle._id, state: "pending" } } },
        { new: true }
      );
    }
    if (pageId) {
      await Page.findByIdAndUpdate(
        pageId,
        { $push: { listArticle: newArticle._id } },
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
    console.error("❌ Lỗi chi tiết khi tạo bài viết:", {
      error: error.message,
      stack: error.stack,
      inputData: data
    });
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
  if (!comments || comments.length === 0) return comments;

  // Populate img và replyComment cho các bình luận con nếu cần
  const populatedComments = await mongoose.model('Comment').populate(comments, [
    { path: "img", select: "url type", match: { _destroy: null } },
    {
      path: "replyComment",
      match: { _destroy: null },
      populate: [
        { path: "img", select: "url type", match: { _destroy: null } },
        { path: "_iduser", select: "displayName avt", populate: { path: "avt", select: "url" } },
      ],
    },
  ]);

  // Đệ quy cho replyComment
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
          // Populate img trong replyComment
          populate: {
            path: "img",
            select: "url type",
            match: { _destroy: null }, // Chỉ lấy media chưa bị xóa
          },
        },
        {
          path: "img", // Populate img trong comments chính
          select: "url type",
          match: { _destroy: null }, // Chỉ lấy media chưa bị xóa
        },
      ],
    })
    .select("comments");

  if (!article || !article.comments) return [];

  let comments = article.comments;

  // Gọi hàm đệ quy để lấy tất cả bình luận con (nếu cần)
  comments = await deepPopulateComments(comments);

  // Ghi log để kiểm tra dữ liệu img
  console.log("Comments with img populated:", JSON.stringify(comments, null, 2));

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
