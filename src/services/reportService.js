import Report from "../models/Report.js";

const getReports = async () => {
  return await Report.find({ _destroy: null })
};

const getReportById = async (id) => {
  return await Report.findOne({ _id: id, _destroy: null })
};

const createReport = async (data) => {
  return await Report.create(data);
};

const updateReportById = async (id, data) => {
  return await Report.findByIdAndUpdate(id, data, { new: true })
};

const updateAllReports = async (data) => {
  return await Report.updateMany({}, data, { new: true });
};

const deleteReportById = async (id) => {
  return await Report.findByIdAndUpdate(id, { _destroy: Date.now() }, { new: true });
};

export const reportService = {
  getReports,
  getReportById,
  createReport,
  updateReportById,
  updateAllReports,
  deleteReportById,
};
