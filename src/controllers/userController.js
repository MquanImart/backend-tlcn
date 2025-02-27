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

    if (!savedGroups.length) {
      return res.status(404).json({ success: false, data: null, message: "Người dùng chưa lưu nhóm nào" });
    }

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

    if (!savedGroups.length) {
      return res.status(404).json({ success: false, data: null, message: "Người dùng chưa lưu nhóm nào" });
    }

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

    // Lấy danh sách nhóm chưa tham gia
    const notJoinedGroups = await userService.getNotJoinedGroups(userId);

    if (!notJoinedGroups.length) {
      return res.status(404).json({ success: false, data: null, message: "Không có nhóm nào chưa tham gia" });
    }

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

    if (!articles.length) {
      return res.status(404).json({ success: false, data: null, message: "Không có bài viết nào đã duyệt" });
    }

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
  getArticleAllGroups,
  getPhotoAvt,
  createCollection,
  deleteCollection,
  getEarliestItems,
  getAllCollection
};
