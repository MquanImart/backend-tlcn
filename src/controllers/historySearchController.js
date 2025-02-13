import { historySearchService } from "../services/historySearchService.js";

const getHistorySearches = async (req, res) => {
  try {
    const historySearches = await historySearchService.getHistorySearches();
    res.status(200).json({ success: true, data: historySearches, message: 'Lấy danh sách lịch sử tìm kiếm thành công' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

const getHistorySearchById = async (req, res) => {
  try {
    const historySearch = await historySearchService.getHistorySearchById(req.params.id);
    if (!historySearch) return res.status(404).json({ success: false, data: null, message: 'Lịch sử tìm kiếm không tồn tại' });
    res.status(200).json({ success: true, data: historySearch, message: 'Lấy lịch sử tìm kiếm thành công' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

const createHistorySearch = async (req, res) => {
  try {
    const newHistorySearch = await historySearchService.createHistorySearch(req.body);
    res.status(201).json({ success: true, data: newHistorySearch, message: 'Tạo lịch sử tìm kiếm thành công' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

const updateHistorySearchById = async (req, res) => {
  try {
    const updatedHistorySearch = await historySearchService.updateHistorySearchById(req.params.id, req.body);
    if (!updatedHistorySearch) return res.status(404).json({ success: false, data: null, message: 'Lịch sử tìm kiếm không tồn tại' });
    res.status(200).json({ success: true, data: updatedHistorySearch, message: 'Cập nhật lịch sử tìm kiếm thành công' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

const updateAllHistorySearches = async (req, res) => {
  try {
    const updatedHistorySearches = await historySearchService.updateAllHistorySearches(req.body);
    res.status(200).json({ success: true, data: updatedHistorySearches, message: 'Cập nhật tất cả lịch sử tìm kiếm thành công' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

const deleteHistorySearchById = async (req, res) => {
  try {
    const deletedHistorySearch = await historySearchService.deleteHistorySearchById(req.params.id);
    if (!deletedHistorySearch) return res.status(404).json({ success: false, data: null, message: 'Lịch sử tìm kiếm không tồn tại' });
    res.status(200).json({ success: true, data: null, message: 'Xóa lịch sử tìm kiếm thành công' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

export const historySearchController = {
  getHistorySearches,
  getHistorySearchById,
  createHistorySearch,
  updateHistorySearchById,
  updateAllHistorySearches,
  deleteHistorySearchById,
};
