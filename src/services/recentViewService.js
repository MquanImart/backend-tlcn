// recentViewService.js
import RecentView from "../models/RecentView.js";

const getRecentViews = async () => {
  return await RecentView.find({ _destroy: null });
};

const getRecentViewById = async (id) => {
  return await RecentView.findOne({ _id: id, _destroy: null });
};

const createRecentView = async (data) => {
  return await RecentView.create(data);
};

const updateRecentViewById = async (id, data) => {
  return await RecentView.findByIdAndUpdate(id, data, { new: true });
};

const updateAllRecentViews = async (data) => {
  return await RecentView.updateMany({}, data, { new: true });
};

const deleteRecentViewById = async (id) => {
  return await RecentView.findByIdAndUpdate(id, { _destroy: Date.now() }, { new: true });
};

export default {
  getRecentViews,
  getRecentViewById,
  createRecentView,
  updateRecentViewById,
  updateAllRecentViews,
  deleteRecentViewById
};
