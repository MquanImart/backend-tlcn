import MyPhoto from "../models/MyPhoto.js";
import { cloudStorageService } from "../config/cloudStorage.js";

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

const uploadAndSaveFile = async (file, userId, type, folderType, referenceId, oldFileUrl = null) => {
  try {
    if (!file || !file.buffer) {
      throw new Error("Không có file hợp lệ để upload!");
    }

    let newFile;

    if (oldFileUrl) {
      const fileName = oldFileUrl.split("/").pop(); // Lấy tên file cũ từ URL
      const destination = `src/images/${folderType}/${referenceId}/${fileName}`;

      const fileUrl = await cloudStorageService.uploadImageBufferToStorage(
        file.buffer,
        destination,
        file.mimetype
      );

      if (!fileUrl) {
        throw new Error("Không lấy được URL sau khi upload!");
      }

      // Cập nhật URL trong database
      newFile = await MyPhoto.findOneAndUpdate(
        { url: oldFileUrl },
        { url: fileUrl, name: file.originalname },
        { new: true }
      );

    } else {
      // Nếu không có ảnh cũ, tạo mới ảnh
      newFile = await MyPhoto.create({
        name: file.originalname,
        idAuthor: userId,
        type: type,
        url: "",
      });

      const fileName = `${newFile._id}`;
      const destination = `src/images/${folderType}/${referenceId}/${fileName}`;

      const fileUrl = await cloudStorageService.uploadImageBufferToStorage(
        file.buffer,
        destination,
        file.mimetype
      );

      if (!fileUrl) {
        throw new Error("Không lấy được URL sau khi upload!");
      }

      newFile.url = fileUrl;
      await newFile.save();
    }

    return newFile;
  } catch (error) {
    console.error("❌ Lỗi khi lưu file:", error);
    throw error;
  }
};





export const myPhotoService = {
  getMyPhotos,
  getMyPhotoById,
  createMyPhoto,
  updateMyPhotoById,
  updateAllMyPhotos,
  deleteMyPhotoById,
  uploadAndSaveFile
};
