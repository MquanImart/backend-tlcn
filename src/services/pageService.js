import Page from "../models/Page.js";
import Province from "../models/Province.js";
import User from "../models/User.js";
import { myPhotoService } from "./myPhotoService.js";
import {addressService} from "./addressService.js"

const getPages = async () => {
  return await Page.find({ deleteAt: null })
};

const getPageById = async (id) => {
  return await Page.findOne({ _id: id, deleteAt: null })
};


const updatePageById = async (id, data) => {
  return await Page.findByIdAndUpdate(id, data, { new: true })
};

const updateAllPages = async (data) => {
  return await Page.updateMany({}, data, { new: true });
};

const createPage = async (req) => {
  const { name, idCreater, address, timeOpen, timeClose, hobbies } = req.body;
  const avtFile = req.file;

  if (!name || !idCreater || !address) {
    throw new Error('Thiếu thông tin bắt buộc: name, idCreater, address');
  }

  const addressData = JSON.parse(address);
  
  let provinceName = addressData.province;
    if (provinceName.startsWith("Tỉnh ")) {
      provinceName = provinceName.replace("Tỉnh ", ""); // Loại bỏ "Tỉnh " ở đầu
    }

  // 1. Tạo địa chỉ mới
  const newAddress = await addressService.createAddress({
    province: addressData.province,
    district: addressData.district,
    ward: addressData.ward,
    street: addressData.street,
    placeName: addressData.placeName || '',
    lat: addressData.lat || null,
    long: addressData.long || null,
  });

  // 2. Xử lý hobbies linh hoạt
  let hobbiesArray = [];
  if (hobbies) {
    try {
      hobbiesArray = JSON.parse(hobbies); // Nếu là JSON
    } catch (e) {
      // Nếu không phải JSON, giả định là chuỗi phân tách bằng dấu phẩy
      hobbiesArray = hobbies.split(',').map(id => id.trim());
    }
  }

  // 3. Tạo dữ liệu Page ban đầu (chưa có avt)
  const pageData = {
    name,
    idCreater,
    address: newAddress._id,
    avt: null, // Ban đầu để null
    timeOpen: timeOpen || '',
    timeClose: timeClose || '',
    hobbies: hobbiesArray,
    follower: [],
    listArticle: [],
    listAdmin: [{ idUser: idCreater, state: 'accepted', joinDate: Date.now() }],
    listTicket: [],
  };

  // 4. Tạo Page trước
  const newPage = await Page.create(pageData);

  // 5. Xử lý ảnh đại diện (nếu có) và cập nhật Page
  if (avtFile) {
    const newPhoto = await myPhotoService.uploadAndSaveFile(
      avtFile,
      idCreater,
      'img',
      'pages',
      newPage._id // Sử dụng _id của Page làm referenceId
    );
    // Cập nhật avt của Page
    await Page.findByIdAndUpdate(
      newPage._id,
      { avt: newPhoto._id },
      { new: true }
    );
    newPage.avt = newPhoto._id; 
  }

  // 6. Cập nhật Province
  await Province.findOneAndUpdate(
    { name: provinceName },
    { $addToSet: { listPage: newPage._id } },
    { upsert: true, new: true }
  );

  // 7. Cập nhật User: thêm newPage._id vào pages.createPages
  await User.findOneAndUpdate(
    { _id: idCreater }, // Tìm user bằng idCreater
    { $addToSet: { 'pages.createPages': newPage._id } }, // Thêm _id của Page vào mảng createPages
    { upsert: false, new: true } // Không tạo mới nếu user không tồn tại
  );

  return newPage;
}

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
