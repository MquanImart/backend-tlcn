import HistorySearch from "../models/HistorySearch.js";

const getHistorySearches = async () => {
  return await HistorySearch.find({ _destroy: null })
};

const getHistorySearchById = async (id) => {
  return await HistorySearch.findOne({ _id: id, _destroy: null })
};

const createHistorySearch = async (data) => {
  return await HistorySearch.create(data);
};

const updateHistorySearchById = async (id, data) => {
  return await HistorySearch.findByIdAndUpdate(id, data, { new: true })
};

const updateAllHistorySearches = async (data) => {
  return await HistorySearch.updateMany({}, data, { new: true });
};

const deleteHistorySearchById = async (id) => {
  return await HistorySearch.findByIdAndUpdate(id, { _destroy: Date.now() }, { new: true });
};

export const historySearchService = {
  getHistorySearches,
  getHistorySearchById,
  createHistorySearch,
  updateHistorySearchById,
  updateAllHistorySearches,
  deleteHistorySearchById,
};
