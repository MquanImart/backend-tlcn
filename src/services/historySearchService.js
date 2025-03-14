// historySearchService.js
import HistorySearch from "../models/HistorySearch.js";

const getHistorySearches = async () => {
  return await HistorySearch.find({ _destroy: null });
};

const getHistorySearchById = async (id) => {
  return await HistorySearch.findOne({ _id: id, _destroy: null });
};

const createHistorySearch = async (data) => {
  return await HistorySearch.create(data);
};

const updateHistorySearchById = async (id, data) => {
  return await HistorySearch.findByIdAndUpdate(id, data, { new: true });
};

const updateAllHistorySearches = async (data) => {
  return await HistorySearch.updateMany({}, data, { new: true });
};

const deleteHistorySearchById = async (id) => {
  return await HistorySearch.findByIdAndUpdate(id, { _destroy: Date.now() }, { new: true });
};

const addHistorySearch = async (idUser, keySearch) => {
  // Tìm bản ghi với idUser
  const existingHistorySearch = await HistorySearch.findOne({ idUser, _destroy: null });

  if (existingHistorySearch) {
    // Nếu tồn tại, thêm keySearch mới vào mảng nếu chưa có
    if (!existingHistorySearch.keySearch.includes(keySearch)) {
      existingHistorySearch.keySearch.push(keySearch);
      return await existingHistorySearch.save();
    }
    return existingHistorySearch; // Trả về bản ghi nếu không có thay đổi
  }

  // Nếu không tồn tại, tạo mới bản ghi
  const newHistorySearch = await createHistorySearch({
    idUser,
    keySearch: [keySearch],
  });
  return newHistorySearch;
};

export const historySearchService = {
  getHistorySearches,
  getHistorySearchById,
  createHistorySearch,
  updateHistorySearchById,
  updateAllHistorySearches,
  deleteHistorySearchById,
  addHistorySearch,
};