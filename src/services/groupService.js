import Group from "../models/Group.js";

const getGroups = async () => {
  return await Group.find({ _destroy: null })
};

const getGroupById = async (id) => {
  return await Group.findOne({ _id: id, _destroy: null }) 
    .populate('avt', 'url name') 
    .populate('members.idUser', '_id'); // Lấy _id của các thành viên trong nhóm
};



const createGroup = async (data) => {
  return await Group.create(data);
};

const updateGroupById = async (id, data) => {
  return await Group.findByIdAndUpdate(id, data, { new: true })
};

const updateAllGroups = async (data) => {
  return await Group.updateMany({}, data, { new: true });
};

const deleteGroupById = async (id) => {
  return await Group.findByIdAndUpdate(id, { _destroy: Date.now() }, { new: true });
};


const requestJoinGroup = async (groupId, userId) => {
  try {
    const group = await Group.findOne({ _id: groupId, _destroy: null });

    if (!group) {
      return { success: false, message: "Nhóm không tồn tại" };
    }
    const existingMember = group.members.find(member => member.idUser.toString() === userId);
    if (existingMember) {
      if (existingMember.state === "accepted") {
        return { success: false, message: "Người dùng đã là thành viên của nhóm" };
      }
      if (existingMember.state === "pending") {
        return { success: false, message: "Người dùng đã gửi yêu cầu tham gia trước đó" };
      }
    }

    group.members.push({ idUser: userId, state: "pending" });
    await group.save();

    return { success: true, message: "Gửi yêu cầu tham gia nhóm thành công" };
  } catch (error) {
    console.error("Lỗi khi gửi yêu cầu tham gia nhóm:", error);
    return { success: false, message: error.message };
  }
};

const requestJoinOrLeaveGroup = async (groupId, userId) => {
  try {
    const group = await Group.findOne({ _id: groupId, _destroy: null });

    if (!group) {
      return { success: false, message: "Nhóm không tồn tại" };
    }

    const existingMemberIndex = group.members.findIndex(member => member.idUser.toString() === userId);

    if (existingMemberIndex !== -1) {
      // Nếu đã tồn tại, xóa khỏi danh sách members
      group.members.splice(existingMemberIndex, 1);
      await group.save();
      return { success: true, message: "Hủy yêu cầu tham gia nhóm thành công" };
    }

    // Nếu chưa tồn tại, thêm vào danh sách với trạng thái "pending"
    group.members.push({ idUser: userId, state: "pending", joinDate: new Date() });
    await group.save();

    return { success: true, message: "Gửi yêu cầu tham gia nhóm thành công" };
  } catch (error) {
    console.error("Lỗi khi xử lý yêu cầu tham gia/hủy nhóm:", error);
    return { success: false, message: error.message };
  }
};

export const groupService = {
  getGroups,
  getGroupById,
  createGroup,
  updateGroupById,
  updateAllGroups,
  deleteGroupById,
  requestJoinGroup,
  requestJoinOrLeaveGroup
};
