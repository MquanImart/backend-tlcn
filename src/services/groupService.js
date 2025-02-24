import Group from "../models/Group.js";
import User from "../models/User.js";
import { articleService } from "../services/articleService.js";
import { myPhotoService } from "./myPhotoService.js";

const getGroups = async () => {
  return await Group.find({ _destroy: null })
};

const getGroupById = async (id) => {
  return await Group.findOne({ _id: id, _destroy: null }) 
    .populate('avt', 'url name') 
    .populate('members.idUser', '_id'); // Lấy _id của các thành viên trong nhóm
};


const createGroup = async ({ groupName, type, idCreater, introduction, rule, hobbies, avatarFile }) => {
  try {

    const normalizeHobbies = Array.isArray(hobbies) 
    ? hobbies 
    : hobbies.split(",").map(hobbie => hobbie.trim());

    const newGroup = await Group.create({
      groupName,
      type,
      idCreater,
      introduction,
      rule,
      hobbies: normalizeHobbies,
      members: [{
        idUser: idCreater,
        state: 'accepted', // Add the creator as a member with state 'accepted'
        joinDate: new Date(),
      }],
      article: [],
      Administrators: [],
    });


    if (avatarFile) {
      const uploadedFile = await myPhotoService.uploadAndSaveFile(avatarFile, idCreater, "img", 'groups', newGroup._id);
      newGroup.avt = uploadedFile._id
      await newGroup.save();
    }

    const user = await User.findById(idCreater);
    if (user) {
      user.groups.createGroups.push(newGroup._id); // Add the new group ID to the createGroups array
      await user.save();
    } else {
      throw new Error("User not found");
    }

    return newGroup;
  } catch (error) {
    console.error("Lỗi khi tạo nhóm:", error);
    throw new Error("Lỗi khi tạo nhóm");
  }
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


const getApprovedArticles = async (groupId) => {
  try {
    const group = await Group.findOne({ _id: groupId, _destroy: null });

    if (!group) {
      throw new Error("Nhóm không tồn tại");
    }

    const approvedArticleIds = group.article
      .filter(article => article.state === "approved")
      .map(article => article.idArticle);

    const approvedArticles = await Promise.all(
      approvedArticleIds.map(async (articleId) => {
        return await articleService.getArticleById(articleId);
      })
    );

    return approvedArticles.filter(article => article !== null);
  } catch (error) {
    console.error("Lỗi khi lấy bài viết đã duyệt:", error);
    throw new Error(error.message);
  }
};

const getPendingArticles = async (groupId) => {
  try {
    const group = await Group.findOne({ _id: groupId, _destroy: null });

    if (!group) {
      throw new Error("Nhóm không tồn tại");
    }

    const pendingArticleIds = group.article
      .filter(article => article.state === "pending")
      .map(article => article.idArticle);

    const pendingArticles = await Promise.all(
      pendingArticleIds.map(async (articleId) => {
        return await articleService.getArticleById(articleId);
      })
    );

    return pendingArticles.filter(article => article !== null);
  } catch (error) {
    console.error("Lỗi khi lấy bài viết đã duyệt:", error);
    throw new Error(error.message);
  }
};

const updateArticleStatus = async (groupId, articleId, action) => {
  try {
    if (!action || !['approve', 'reject'].includes(action)) {
      return {
        success: false,
        status: 400,
        message: 'Hành động không hợp lệ. Vui lòng chọn "approve" hoặc "reject".',
      };
    }

    // Tìm nhóm theo ID
    const group = await Group.findOne({ _id: groupId, _destroy: null }).exec();
    if (!group) {
      return {
        success: false,
        status: 404,
        message: 'Nhóm không tồn tại',
      };
    }

    const articleIndex = group.article.findIndex((article) => article.idArticle.toString() === articleId);
    if (articleIndex === -1) {
      return {
        success: false,
        status: 404,
        message: 'Bài viết không tồn tại trong nhóm',
      };
    }

    if (action === 'approve') {
      group.article[articleIndex].state = 'approved';
    } else if (action === 'reject') {
      group.article[articleIndex].state = 'rejected'; 
    }

    await group.save();

    return { success: true, message: `Bài viết đã được ${action === 'approve' ? 'duyệt' : 'hủy duyệt'} thành công.` };
  } catch (error) {
    console.error('Lỗi khi xử lý bài viết:', error);
    throw new Error('Lỗi server');
  }
};

const getRulesById = async (groupId) => {
  return await Group.findOne({ _id: groupId, _destroy: null }) 
    .select('rule')
};

const addRuleToGroup = async (groupId, rule) => {
  const group = await Group.findById(groupId);

  if (!group) {
    throw new Error('Nhóm không tồn tại');
  }
  if (group.rule.includes(rule)) {
    throw new Error('Quy tắc đã tồn tại');
  }

  group.rule.push(rule);

  return await group.save();
};



const deleteRuleFromGroup = async (groupId, ruleValue) => {
  try {
    const group = await Group.findOne({ _id: groupId, _destroy: null });
    if (!group) {
      return { success: false, message: 'Nhóm không tồn tại' };
    }

    const ruleIndex = group.rule.indexOf(ruleValue);
    if (ruleIndex === -1) {
      return { success: false, message: 'Quy tắc không tồn tại' };
    }

    group.rule.splice(ruleIndex, 1);
    await group.save();

    return { success: true, message: 'Xóa quy tắc thành công', data: group };
  } catch (error) {
    console.error('Lỗi khi xóa quy tắc:', error);
    return { success: false, message: 'Lỗi server' };
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
  requestJoinOrLeaveGroup,
  getApprovedArticles,
  getPendingArticles,
  updateArticleStatus,
  getRulesById,
  addRuleToGroup,
  deleteRuleFromGroup
};
