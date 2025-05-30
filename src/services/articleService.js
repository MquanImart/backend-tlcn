import Article from "../models/Article.js";
import Comment from "../models/Comment.js";
import Group from "../models/Group.js";
import Page from "../models/Page.js";
import User from "../models/User.js";
import { myPhotoService } from "./myPhotoService.js";
import {addressService} from "./addressService.js";
import mongoose from 'mongoose';
import { emitEvent } from "../socket/socket.js";
import { articleTagsService } from "./articleTagsService.js";

const getArticles = async ({ limit = 5, skip = 0, filter = {}, province } = {}) => {
  let query = Article.find(filter);

  // If province is provided, use aggregation to filter by province
  if (province) {
    query = Article.aggregate([
      // Match articles based on the provided filter
      { $match: filter },
      // Lookup to join with Address collection
      {
        $lookup: {
          from: 'addresses', // Collection name in MongoDB (lowercase plural of model name)
          localField: 'address',
          foreignField: '_id',
          as: 'addressData',
        },
      },
      // Unwind the addressData array
      { $unwind: { path: '$addressData', preserveNullAndEmptyArrays: true } },
      // Match articles where province matches
      {
        $match: {
          'addressData.province': province,
          'addressData._destroy': null, // Ensure address is not soft-deleted
        },
      },
      // Populate other fields
      {
        $lookup: {
          from: 'users',
          localField: 'createdBy',
          foreignField: '_id',
          as: 'createdBy',
        },
      },
      { $unwind: '$createdBy' },
      {
        $lookup: {
          from: 'myphotos',
          localField: 'createdBy.avt',
          foreignField: '_id',
          as: 'createdBy.avt',
        },
      },
      { $unwind: { path: '$createdBy.avt', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'myphotos',
          localField: 'listPhoto',
          foreignField: '_id',
          as: 'listPhoto',
        },
      },
      {
        $lookup: {
          from: 'groups',
          localField: 'groupID',
          foreignField: '_id',
          as: 'groupID',
        },
      },
      { $unwind: { path: '$groupID', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'addresses',
          localField: 'address',
          foreignField: '_id',
          as: 'address',
        },
      },
      { $unwind: { path: '$address', preserveNullAndEmptyArrays: true } },
      // Project the required fields
      {
        $project: {
          createdBy: {
            _id: 1,
            displayName: 1,
            avt: { _id: 1, name: 1, idAuthor: 1, type: 1, url: 1, createdAt: 1, updatedAt: 1 },
          },
          listPhoto: {
            $map: {
              input: '$listPhoto',
              as: 'photo',
              in: {
                _id: '$$photo._id',
                name: '$$photo.name',
                idAuthor: '$$photo.idAuthor',
                type: '$$photo.type',
                url: '$$photo.url',
                createdAt: '$$photo.createdAt',
                updatedAt: '$$photo.updatedAt',
              },
            },
          },
          groupID: { _id: 1, groupName: 1 },
          address: {
            _id: 1,
            province: 1,
            district: 1,
            ward: 1,
            street: 1,
            placeName: 1,
            lat: 1,
            long: 1,
          },
          content: 1,
          hashTag: 1,
          scope: 1,
          emoticons: 1,
          comments: 1,
          createdAt: 1,
          updatedAt: 1,
          _destroy: 1,
        },
      },
      // Sort by createdAt in descending order
      { $sort: { createdAt: -1 } },
      // Apply pagination
      { $skip: skip },
      { $limit: limit },
    ]);

    // Get total count for pagination
    const totalPipeline = [
      { $match: filter },
      {
        $lookup: {
          from: 'addresses',
          localField: 'address',
          foreignField: '_id',
          as: 'addressData',
        },
      },
      { $unwind: { path: '$addressData', preserveNullAndEmptyArrays: true } },
      {
        $match: {
          'addressData.province': province,
          'addressData._destroy': null,
        },
      },
      { $count: 'total' },
    ];

    const totalResult = await Article.aggregate(totalPipeline);
    const total = totalResult.length > 0 ? totalResult[0].total : 0;

    // Execute the main query
    const articles = await query;

    return { articles, total };
  }

  // If no province filter, use the original query
  const total = await Article.countDocuments(filter);

  const articles = await query
    .populate({
      path: 'createdBy',
      select: '_id displayName avt',
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
      select: '_id groupName',
    })
    .populate({
      path: 'address',
      select: '_id province district ward street placeName lat long',
    })
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip);

  return { articles, total };
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
    
    await articleTagsService.createArticleTagByArticle(newArticle, uploadedMedia);
    
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

  // Phát sự kiện Socket.IO
  emitEvent("post", articleId, "postLiked", {
    articleId,
    userId,
    emoticons: article.emoticons, // Gửi danh sách emoticons mới
  });

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
