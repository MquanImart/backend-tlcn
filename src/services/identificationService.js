import Identification from "../models/Identification.js";

const getIdentifications = async () => {
  return await Identification.find({ _destroy: null });
};

const getIdentificationById = async (id) => {
  return await Identification.findOne({ _id: id, _destroy: null });
};

const createIdentification = async (data) => {
  return await Identification.create(data);
};

const updateIdentificationById = async (id, data) => {
  return await Identification.findByIdAndUpdate(id, data, { new: true });
};

const updateAllIdentifications = async (data) => {
  return await Identification.updateMany({}, data, { new: true });
};

const deleteIdentificationById = async (id) => {
  return await Identification.findByIdAndUpdate(id, { _destroy: Date.now() }, { new: true });
};

export const identificationService = {
  getIdentifications,
  getIdentificationById,
  createIdentification,
  updateIdentificationById,
  updateAllIdentifications,
  deleteIdentificationById,
};
