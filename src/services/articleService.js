import Article from "../models/Article.js";

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
      path: 'comments',
      select: '_id _iduser content img replyComment emoticons createdAt updatedAt',
      populate: {
        path: '_iduser',
        select: '_id displayName avt',
        populate: {
          path: 'avt',
          select: '_id name type url createdAt',
        },
      },
    })
    .populate({
      path: 'emoticons',
      select: '_id displayName avt',
      populate: {
        path: 'avt',
        select: '_id name type url',
      },
    })
    .populate({
      path: 'groupID',
      select: '_id groupName type idCreater introduction avt members hobbies createdAt',
      populate: {
        path: 'idCreater',
        select: '_id displayName avt',
      },
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

export const articleService = {
  getArticles,
  getArticleById,
  createArticle,
  updateArticleById,
  updateAllArticles,
  deleteArticleById,
};
