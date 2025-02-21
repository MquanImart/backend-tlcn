import { groupService } from '../services/groupService.js';

const getGroups = async (req, res) => {
  try {
    const groups = await groupService.getGroups();
    res.status(200).json({ success: true, data: groups, message: 'Lấy danh sách nhóm thành công' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

const getGroupById = async (req, res) => {
  try {
    const group = await groupService.getGroupById(req.params.id);
    if (!group) return res.status(404).json({ success: false, data: null, message: 'Nhóm không tồn tại' });
    res.status(200).json({ success: true, data: group, message: 'Lấy nhóm thành công' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

const createGroup = async (req, res) => {
  try {
    const newGroup = await groupService.createGroup(req.body);
    res.status(201).json({ success: true, data: newGroup, message: 'Tạo nhóm thành công' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

const updateGroupById = async (req, res) => {
  try {
    const updatedGroup = await groupService.updateGroupById(req.params.id, req.body);
    if (!updatedGroup) return res.status(404).json({ success: false, data: null, message: 'Nhóm không tồn tại' });
    res.status(200).json({ success: true, data: updatedGroup, message: 'Cập nhật nhóm thành công' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

const updateAllGroups = async (req, res) => {
  try {
    const updatedGroups = await groupService.updateAllGroups(req.body);
    res.status(200).json({ success: true, data: updatedGroups, message: 'Cập nhật tất cả nhóm thành công' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

const deleteGroupById = async (req, res) => {
  try {
    const deletedGroup = await groupService.deleteGroupById(req.params.id);
    if (!deletedGroup) return res.status(404).json({ success: false, data: null, message: 'Nhóm không tồn tại' });
    res.status(200).json({ success: true, data: null, message: 'Xóa nhóm thành công' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

const requestJoinOrLeaveGroup = async (req, res) => {
  try {
    const { id: groupId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ success: false, message: "Thiếu thông tin người dùng" });
    }

    const response = await groupService.requestJoinOrLeaveGroup(groupId, userId);

    res.status(response.success ? 200 : 400).json(response);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getApprovedArticles = async (req, res) => {
  try {
    const groupId = req.params.id;

    // Gọi service để lấy bài viết đã duyệt
    const approvedArticles = await groupService.getApprovedArticles(groupId);

    if (!approvedArticles.length) {
      return res.status(404).json({
        success: false,
        data: [],
        message: "Không có bài viết nào đã được duyệt trong nhóm",
      });
    }

    res.status(200).json({
      success: true,
      data: approvedArticles,
      message: "Lấy danh sách bài viết đã duyệt thành công",
    });
  } catch (error) {
    console.error("Lỗi khi lấy bài viết đã duyệt:", error);
    res.status(500).json({
      success: false,
      data: null,
      message: "Lỗi server",
    });
  }
};

const getPendingArticles = async (req, res) => {
  try {
    const groupId = req.params.id;

    // Gọi service để lấy bài viết đã duyệt
    const approvedArticles = await groupService.getPendingArticles(groupId);

    if (!approvedArticles.length) {
      return res.status(404).json({
        success: false,
        data: [],
        message: "Không có bài viết nào đã được duyệt trong nhóm",
      });
    }

    res.status(200).json({
      success: true,
      data: approvedArticles,
      message: "Lấy danh sách bài viết đã duyệt thành công",
    });
  } catch (error) {
    console.error("Lỗi khi lấy bài viết đã duyệt:", error);
    res.status(500).json({
      success: false,
      data: null,
      message: "Lỗi server",
    });
  }
};

const updateArticleStatus = async (req, res) => {
  const { id: groupId, articleId } = req.params;
  const { action } = req.body;

  try {
    // Gọi service để cập nhật trạng thái bài viết
    const result = await groupService.updateArticleStatus(groupId, articleId, action);

    if (result.success) {
      return res.status(200).json({
        success: true,
        message: `Bài viết đã được ${action === 'approve' ? 'duyệt' : 'hủy duyệt'} thành công.`,
      });
    } else {
      return res.status(result.status).json(result);
    }
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái bài viết:', error);
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};


export const groupController = {
  getGroups,
  getGroupById,
  createGroup,
  updateGroupById,
  updateAllGroups,
  deleteGroupById,
  requestJoinOrLeaveGroup,
  getApprovedArticles,
  getPendingArticles,
  updateArticleStatus
};
