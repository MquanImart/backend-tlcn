import Article from "../models/Article.js";
import Comment from "../models/Comment.js";

const getArticles = async () => {
  return await Article.find({ _destroy: null })
    .populate({
      path: 'createdBy',
      select: '_id displayName hashtag address avt aboutMe createdAt hobbies friends articles groups follow setting',
      populate: {
        path: 'avt',
        select: '_id name idAuthor type url createdAt updateAt',
      },
    })
    .populate({
      path: 'listPhoto',
      select: '_id name idAuthor type url createdAt updateAt',
      populate: {
        path: 'idAuthor',
        select: '_id displayName avt',
      },
    })
    .populate({
      path: 'groupID',
      select: '_id groupName type idCreater introduction avt members hobbies createdAt',
    })
    .populate({
      path: 'address',
      select: '_id province district ward street placeName lat long',
    })
    .sort({ createdAt: -1 });
};


const getArticleById = async (id) => {
  return await Article.findOne({ _id: id, _destroy: null })
};

const createArticle = async (data) => {
  return await Article.create(data);
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
  return await Comment.populate(comments, {
    path: "replyComment",
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
  });
};

/**
 * Lấy tất cả bình luận của bài viết, bao gồm tất cả bình luận con (đệ quy)
 */
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
