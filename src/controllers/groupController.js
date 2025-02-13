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

export const groupController = {
  getGroups,
  getGroupById,
  createGroup,
  updateGroupById,
  updateAllGroups,
  deleteGroupById,
};
