import { userService } from '../services/userService.js';

import User from "../models/User.js";
import Account from "../models/Account.js";
import Hobby from "../models/Hobby.js";
const getUsers = async (req, res) => {
  try {
    const users = await userService.getUsers();
    res.status(200).json({ success: true, data: users, message: 'Lấy danh sách người dùng thành công' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) return res.status(404).json({ success: false, data: null, message: 'Người dùng không tồn tại' });
    res.status(200).json({ success: true, data: user, message: 'Lấy thông tin người dùng thành công' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const newUser = await userService.createUser(req.body);
    res.status(201).json({ success: true, data: newUser, message: 'Tạo người dùng thành công' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

const updateUserById = async (req, res) => {
  try {
    const updatedUser = await userService.updateUserById(req.params.id, req.body);
    if (!updatedUser) return res.status(404).json({ success: false, data: null, message: 'Người dùng không tồn tại' });
    res.status(200).json({ success: true, data: updatedUser, message: 'Cập nhật người dùng thành công' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

const updateAllUsers = async (req, res) => {
  try {
    const updatedUsers = await userService.updateAllUsers(req.body);
    res.status(200).json({ success: true, data: updatedUsers, message: 'Cập nhật tất cả người dùng thành công' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

const deleteUserById = async (req, res) => {
  try {
    const deletedUser = await userService.deleteUserById(req.params.id);
    if (!deletedUser) return res.status(404).json({ success: false, data: null, message: 'Người dùng không tồn tại' });
    res.status(200).json({ success: true, data: null, message: 'Xóa người dùng thành công' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};
const addHobbyByEmail = async (req, res) => {
  try {
      const { email, hobbies } = req.body;

      console.log("📩 Nhận dữ liệu từ client:", { email, hobbies });

      // Kiểm tra đầu vào
      if (!email || !Array.isArray(hobbies) || hobbies.length === 0) {
          return res.status(400).json({ success: false, message: "Vui lòng cung cấp email và danh sách hobbies hợp lệ." });
      }

      // Tìm `account` theo `email`
      const account = await Account.findOne({ email });
      if (!account) {
          return res.status(404).json({ success: false, message: "Tài khoản không tồn tại." });
      }

      // Tìm `user` theo `account._id`
      const user = await User.findOne({ account: account._id });
      if (!user) {
          return res.status(404).json({ success: false, message: "Người dùng không tồn tại." });
      }

      // Kiểm tra xem sở thích đã có trong database chưa
      const existingHobbies = await Hobby.find({ name: { $in: hobbies } });

      // Lọc ra các hobby đã tồn tại
      const existingHobbyIds = existingHobbies.map(hobby => hobby._id);
      const existingNames = existingHobbies.map(hobby => hobby.name);

      // Tạo mới các hobby chưa có trong database
      const newHobbies = hobbies
          .filter(hobby => !existingNames.includes(hobby))
          .map(name => ({ name }));


      let insertedHobbies = [];
      if (newHobbies.length > 0) {
          insertedHobbies = await Hobby.insertMany(newHobbies);
      }

      // Lấy danh sách ID của các hobby mới thêm
      const allHobbyIds = [...existingHobbyIds, ...insertedHobbies.map(hobby => hobby._id)];

      // Kiểm tra xem user đã có những sở thích này chưa
      const hobbiesToAdd = allHobbyIds.filter(hobbyId => !user.hobbies.includes(hobbyId));

      if (hobbiesToAdd.length === 0) {
          return res.status(400).json({ success: false, message: "Người dùng đã có những sở thích này." });
      }

      // Cập nhật danh sách sở thích của user
      user.hobbies.push(...hobbiesToAdd);
      await user.save();

      return res.status(200).json({
          success: true,
          message: "Thêm sở thích thành công!",
          user,
      });
  } catch (error) {
      console.error("❌ Lỗi thêm sở thích vào user:", error);
      return res.status(500).json({ success: false, message: "Lỗi hệ thống, vui lòng thử lại." });
  }
};
const getSavedGroups = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await userService.getUserById(userId);
    
    if (!user) {
      return res.status(404).json({ success: false, data: null, message: "Người dùng không tồn tại" });
    }

    const savedGroups = await userService.getSavedGroups(userId);

    res.status(200).json({ success: true, data: savedGroups, message: "Lấy danh sách nhóm đã lưu thành công" });

  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

const getMyGroups = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await userService.getUserById(userId);
    
    if (!user) {
      return res.status(404).json({ success: false, data: null, message: "Người dùng không tồn tại" });
    }

    const savedGroups = await userService.getMyGroups(userId);

    res.status(200).json({ success: true, data: savedGroups, message: "Lấy danh sách nhóm đã lưu thành công" });

  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

const getNotJoinedGroups = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await userService.getUserById(userId);
    if (!user) {
      return res.status(404).json({ success: false, data: null, message: "Người dùng không tồn tại" });
    }

    const notJoinedGroups = await userService.getNotJoinedGroups(userId);

    res.status(200).json({ success: true, data: notJoinedGroups, message: "Lấy danh sách nhóm chưa tham gia thành công" });

  } catch (error) {
    console.error("Lỗi khi lấy danh sách nhóm chưa tham gia:", error);
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

const getArticleAllGroups = async (req, res) => {
  try {
    const userId = req.params.id;

    // Kiểm tra người dùng có tồn tại hay không
    const user = await userService.getUserById(userId);
    if (!user) {
      return res.status(404).json({ success: false, data: null, message: "Người dùng không tồn tại" });
    }

    // Lấy tất cả bài viết đã duyệt từ các nhóm người dùng tham gia
    const articles = await userService.getArticleAllGroups(userId);

    // Trả về danh sách bài viết
    res.status(200).json({ success: true, data: articles, message: "Lấy danh sách bài viết đã duyệt thành công" });

  } catch (error) {
    console.error("Lỗi khi lấy bài viết đã duyệt:", error);
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

const getPhotoAvt = async (req, res) => {
  try {
    const myPhotos = await userService.getPhotoAvt(req.params.id, req.query);
    res.status(200).json({ success: true, data: myPhotos, message: 'Lấy danh sách ảnh đại diện' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

const createCollection = async (req, res) => {
  try {
    const result = await userService.createCollection(req.body.userId, req.body.name, req.body.type);
    res.status(200).json({ success: true, data: result, message: 'Tạo bộ sưu tập thành công' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

const deleteCollection = async (req, res) => {
  try {
    const result = await userService.deleteCollection(req.params.id, req.query.collectionId);
    res.status(200).json({ success: true, data: result, message: 'Xóa bộ sưu tập thành công' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

const getAllCollection = async (req, res) => {
  try {
    const result = await userService.getAllCollection(req.params.id);
    res.status(200).json({ success: true, data: result, message: 'Lấy danh sách bộ sưu tập thành công' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};


const getEarliestItems = async (req, res) => {
  try {
    const result = await userService.getEarliestItems(req.params.id, req.query.limit);
    res.status(200).json({ success: true, data: result, message: 'Lấy danh sách gần đây' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

const updateUserSetting = async (req, res) => {
  try {
    const { id } = req.params;
    const { setting } = req.body;

    // Kiểm tra setting có tồn tại hay không
    if (!setting || typeof setting !== 'object') {
      return res.status(400).json({ success: false, message: 'Dữ liệu setting không hợp lệ' });
    }

    // Cập nhật setting của user
    const updatedUser = await userService.updateUserSetting(id, setting);

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'Người dùng không tồn tại' });
    }

    res.status(200).json({
      success: true,
      data: updatedUser.setting,
      message: 'Cập nhật setting thành công',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllFriends = async (req, res) => {
  try {
    const result = await userService.getAllFriends(req.params.id);
    res.status(200).json({ success: true, data: result, message: 'Lấy danh sách bạn bè' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

const unFriends = async (req, res) => {
  try {
    const { friendId } = req.body;
    const dataAddFriend = await userService.unFriends(req.params.id, friendId)
    if (!dataAddFriend) return res.status(404).json({ success: false, data: null, message: 'Không có thông tin' })
    res.status(200).json({ success: true, data: dataAddFriend, message: 'Hủy kết bạn thành công' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const suggestedFriends = async (req, res) => {
  try {
    const dataAddFriend = await userService.suggestFriends(req.params.id)
    if (!dataAddFriend) return res.status(404).json({ success: false, data: null, message: 'Không có thông tin' })
    res.status(200).json({ success: true, data: dataAddFriend, message: 'Lấy danh sách gợi ý thành công' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

export const userController = {
  getUsers,
  getUserById,
  createUser,
  updateUserById,
  updateAllUsers,
  deleteUserById,
  addHobbyByEmail,
  getSavedGroups,
  getMyGroups,
  getNotJoinedGroups,
  getArticleAllGroups,
  getPhotoAvt,
  createCollection,
  deleteCollection,
  getEarliestItems,
  getAllCollection,
  updateUserSetting,
  getAllFriends,
  unFriends,
  suggestedFriends
};
