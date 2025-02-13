import Article from "../models/Article.js";

const getArticles = async () => {
  return await Article.find({ _destroy: null })
};

const getArticleById = async (id) => {
  return await Article.findOne({ _id: id, _destroy: null })
};

const createArticle = async (data) => {
  return await Article.create(data);
};

const updateArticleById = async (id, data) => {
  return await Article.findByIdAndUpdate(id, data, { new: true })
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
