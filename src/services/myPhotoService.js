import MyPhoto from "../models/MyPhoto.js";

const getMyPhotos = async () => {
  return await MyPhoto.find({ _destroy: null })
};

const getMyPhotoById = async (id) => {
  return await MyPhoto.findOne({ _id: id, _destroy: null })
};

const createMyPhoto = async (data) => {
  return await MyPhoto.create(data);
};

const updateMyPhotoById = async (id, data) => {
  return await MyPhoto.findByIdAndUpdate(id, data, { new: true })
};

const updateAllMyPhotos = async (data) => {
  return await MyPhoto.updateMany({}, data, { new: true });
};

const deleteMyPhotoById = async (id) => {
  return await MyPhoto.findByIdAndUpdate(id, { _destroy: Date.now() }, { new: true });
};

export const myPhotoService = {
  getMyPhotos,
  getMyPhotoById,
  createMyPhoto,
  updateMyPhotoById,
  updateAllMyPhotos,
  deleteMyPhotoById,
};
