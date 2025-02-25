import { userService } from '../services/userService.js';

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

export const userController = {
  getUsers,
  getUserById,
  createUser,
  updateUserById,
  updateAllUsers,
  deleteUserById,
  getSavedGroups,
  getMyGroups,
  getNotJoinedGroups,
  getArticleAllGroups
};
