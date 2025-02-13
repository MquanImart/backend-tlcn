import Page from "../models/Page.js";

const getPages = async () => {
  return await Page.find({ deleteAt: null })
};

const getPageById = async (id) => {
  return await Page.findOne({ _id: id, deleteAt: null })
};

const createPage = async (data) => {
  return await Page.create(data);
};

const updatePageById = async (id, data) => {
  return await Page.findByIdAndUpdate(id, data, { new: true })
};

const updateAllPages = async (data) => {
  return await Page.updateMany({}, data, { new: true });
};

const deletePageById = async (id) => {
  return await Page.findByIdAndUpdate(id, { deleteAt: Date.now() }, { new: true });
};

export const pageService = {
  getPages,
  getPageById,
  createPage,
  updatePageById,
  updateAllPages,
  deletePageById,
};
