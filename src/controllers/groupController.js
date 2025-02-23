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

    res.status(200).json({ success: true, data: null, message: response });
  } catch (error) {
    res.status(500).json({ success: false, data: null,  message: error.message });
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
        data: result,
        message: `Bài viết đã được ${action === 'approve' ? 'duyệt' : 'hủy duyệt'} thành công.`,
      });
    }
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái bài viết:', error);
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

const getRulesById = async (req, res) => {
  try {
    const groupId = req.params.id;
    const rules = await groupService.getRulesById(groupId);
    res.status(200).json({ success: true, data: rules, message: 'Lấy danh sách quy định thành công' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

const addRuleToGroup = async (req, res) => {
  try {
    const { id: groupId } = req.params;
    const { rule } = req.body;

    if (!rule) {
      return res.status(400).json({ success: false, data: null, message: 'Quy tắc không được để trống' });
    }

    const updatedGroup = await groupService.addRuleToGroup(groupId, rule);

    if (!updatedGroup) {
      return res.status(404).json({ success: false, data: null, message: 'Nhóm không tồn tại' });
    }

    res.status(200).json({ success: true, data: null, message: 'Thêm quy tắc thành công' });
  } catch (error) {
    if (error.message === 'Quy tắc đã tồn tại') {
      return res.status(400).json({ success: false, data: null, message: 'Quy tắc đã tồn tại' });
    }

    console.error(error);
    res.status(500).json({ success: false, data: null, message: 'Lỗi máy chủ' });
  }
};


const deleteRule = async (req, res) => {
  const { id: groupId, ruleValue } = req.params;

  const result = await groupService.deleteRuleFromGroup(groupId, ruleValue);

  // Trả về kết quả từ service
  if (result.success) {
    return res.status(200).json({
      success: result.success,
      message: result.message,
      data: result.data,  // Có thể trả về dữ liệu nhóm đã cập nhật nếu cần
    });
  } else {
    return res.status(404).json({
      success: result.success,
      message: result.message,
    });
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
  updateArticleStatus,
  getRulesById,
  addRuleToGroup,
  deleteRule
};
