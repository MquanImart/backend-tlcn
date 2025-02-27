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
export const userController = {
  getUsers,
  getUserById,
  createUser,
  updateUserById,
  updateAllUsers,
  deleteUserById,
  addHobbyByEmail,
};
