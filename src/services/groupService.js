import Group from "../models/Group.js";
import User from "../models/User.js";
import Article from "../models/Article.js";
import MyPhoto from "../models/MyPhoto.js";
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
  try {
    const group = await Group.findById(id).populate("avt");
    if (!group) return null;

    if (data.groupName) group.groupName = data.groupName;
    if (data.type) group.type = data.type;
    if (data.introduction) group.introduction = data.introduction;
    if (data.rule) {
      group.rule = Array.isArray(data.rule) ? data.rule : data.rule.split(",");
    }
    if (data.hobbies) {
      group.hobbies = Array.isArray(data.hobbies) ? data.hobbies : data.hobbies.split(",");
    }

    if (data.avatarFile) {
      const oldFileUrl = group.avt?.url || null;
      const uploadedFile = await myPhotoService.uploadAndSaveFile(
        data.avatarFile,
        group.idCreater,
        "img",
        "groups",
        group._id,
        oldFileUrl
      );

      group.avt = uploadedFile._id;
    }

    // Lưu lại nhóm sau khi cập nhật
    await group.save();
    return group;
  } catch (error) {
    console.error("Lỗi khi cập nhật nhóm:", error);
    throw new Error("Lỗi khi cập nhật nhóm");
  }
};


const updateAllGroups = async (data) => {
  return await Group.updateMany({}, data, { new: true });
};

const deleteGroupById = async (groupId) => {
  try {
    const group = await Group.findById(groupId);
    if (!group) throw new Error("Nhóm không tồn tại");

    group._destroy = new Date();
    await group.save();

    if (group.avt) {
      await MyPhoto.findByIdAndUpdate(group.avt, { _destroy: new Date() });
    }

    await Article.updateMany({ groupID: groupId }, { _destroy: new Date() });

    await User.updateOne(
      { _id: group.idCreater },
      { $pull: { "groups.createGroups": groupId } }
    );

    await User.updateMany(
      { "groups.saveGroups": groupId },
      { $pull: { "groups.saveGroups": groupId } }
    );

    return group;
  } catch (error) {
    console.error("❌ Lỗi khi xóa nhóm:", error);
    throw new Error("Lỗi khi xóa nhóm");
  }
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

const getPendingMembers = async (groupID) => {
  try {
    const group = await Group.findById(groupID)
      .populate({
        path: 'members.idUser',
        select: 'displayName avt',
        populate: {
          path: 'avt',
          select: 'url',
        },
      });

    if (!group) {
      throw new Error("Nhóm không tồn tại");
    }

    const pendingMembers = group.members
      .filter(member => member.state === "pending")
      .map(member => ({
        id: member.idUser?._id,
        fullName: member.idUser?.displayName,
        email: member.idUser?.account?.email,
        phone: member.idUser?.account?.phone,
        avatar: member.idUser?.avt[0]?.url || null,
        joinDate: member.joinDate,
      }));

    return pendingMembers;
  } catch (error) {
    throw error;
  }
};

const updateMemberStatus = async (groupID, userID, state) => {
  const group = await Group.findById(groupID);
  if (!group) throw { status: 404, message: "Nhóm không tồn tại" };

  const user = await User.findById(userID);
  if (!user) throw { status: 404, message: "Người dùng không tồn tại" };

  const isMember = group.members.find((member) => member.idUser.toString() === userID);
  const isAdmin = group.Administrators.find((admin) => admin.idUser.toString() === userID);
  const isOwner = group.idCreater.toString() === userID;

  if (isOwner) throw { status: 403, message: "Không thể cập nhật người tạo nhóm" };

  if (state === "invite-admin" && isMember) {
    group.Administrators.push({ idUser: userID, state: "pending" });
  } else if (state === "accept-admin" && isAdmin) {
    const adminIndex = group.Administrators.findIndex(admin => admin.idUser.toString() === userID);
    if (adminIndex !== -1) {
      group.Administrators[adminIndex].state = "accepted";
    } else {
      group.Administrators.push({ idUser: userID, state: "accepted" });
    }
  } else if (state === "remove-admin" && isAdmin) {
    group.Administrators = group.Administrators.filter(admin => admin.idUser.toString() !== userID);
  } else if (state === "accepted" && isMember) {
    isMember.state = "accepted";
  } else if (state === "rejected") {
    group.members = group.members.filter((member) => member.idUser.toString() !== userID);
    user.groups.saveGroups = user.groups.saveGroups.filter(groupId => groupId.toString() !== groupID);
  } else {
    throw { status: 400, message: "Không thể cập nhật trạng thái" };
  }

  await group.save();
  return { id: userID, state };
};

const getGroupMembers = async (groupID) => {
  const group = await Group.findById(groupID)
    .populate({
      path: "idCreater",
      select: "displayName avt aboutMe",
      populate: { path: "avt", select: "url" },
    })
    .populate({
      path: "Administrators.idUser",
      select: "displayName avt aboutMe",
      populate: { path: "avt", select: "url" },
    })
    .populate({
      path: "members.idUser",
      select: "displayName avt aboutMe",
      populate: { path: "avt", select: "url" },
    });

  if (!group) {
    throw { status: 404, message: "Nhóm không tồn tại" };
  }

  const idCreaterID = group.idCreater?._id?.toString();

  const uniqueAdmins = group.Administrators
    .filter((admin) => 
      admin.state === "accepted" && 
      admin.idUser?._id?.toString() !== idCreaterID) 
    .map((admin) => ({
      id: admin.idUser?._id?.toString(),
      name: admin.idUser?.displayName || "Không có thông tin",
      avatar: admin.idUser?.avt[0]?.url || "",
      description: admin.idUser?.aboutMe || "",
    }));

  const uniqueMembers = group.members
    .filter((member) => 
      member.state === "accepted" && 
      member.idUser?._id?.toString() !== idCreaterID && 
      !uniqueAdmins.some((admin) => admin.id === member.idUser?._id?.toString()) 
    )
    .map((member) => ({
      id: member.idUser?._id?.toString(),
      name: member.idUser?.displayName || "Không có thông tin",
      avatar: member.idUser?.avt[0]?.url || "",
      description: member.idUser?.aboutMe || "",
    }));

  return {
    idCreater: {
      id: idCreaterID,
      name: group.idCreater?.displayName || "Không có thông tin",
      avatar: group.idCreater?.avt[0]?.url || "",
      description: group.idCreater?.aboutMe || "",
    },
    Administrators: uniqueAdmins,
    members: uniqueMembers,
  };
};

const getUserApprovedArticles = async (groupID, userID) => {
  const group = await Group.findById(groupID);
  if (!group) {
    throw { status: 404, message: "Nhóm không tồn tại" };
  }

  // Lọc danh sách bài viết đã được duyệt của user đó
  const approvedArticles = group.article
    .filter((a) => a.state === "approved")
    .map((a) => a.idArticle);

  // Truy vấn bài viết theo danh sách đã lọc với đầy đủ thông tin
  const articles = await Article.find({
    _id: { $in: approvedArticles },
    createdBy: userID, // Chỉ lấy bài viết của user này
    _destroy: null,
  })
    .populate({
      path: "createdBy",
      select: "_id displayName avt",
      populate: {
        path: "avt",
        select: "_id name idAuthor type url createdAt updateAt",
      },
    })
    .populate({
      path: "listPhoto",
      select: "_id name idAuthor type url createdAt updateAt",
      populate: {
        path: "idAuthor",
        select: "_id displayName avt",
      },
    })
    .populate({
      path: "groupID",
      select: "_id groupName",
    })
    .populate({
      path: "address",
      select: "_id province district ward street placeName lat long",
    })
    .sort({ createdAt: -1 });

  return articles;
};


const checkAdminInvite = async (groupID, administratorsID) => {
  try {
    // 🔍 Kiểm tra nhóm có tồn tại không
    const group = await Group.findById(groupID)
      .populate({
        path: "idCreater",
        select: "displayName avt",
        populate: { path: "avt", select: "url" },
      });

    if (!group) {
      throw { status: 404, message: "Nhóm không tồn tại" };
    }

    const adminInvite = group.Administrators.find(
      (admin) => admin.idUser.toString() === administratorsID && admin.state === "pending"
    );

    return {
      hasInvite: adminInvite ? true : false,
      groupId: group._id.toString(),
      groupName: group.groupName,
      inviterName: group.idCreater?.displayName || "Không có thông tin",
      inviteDate: adminInvite?.joinDate ? adminInvite.joinDate.toISOString() : null,
      inviterAvatar: group.idCreater?.avt[0]?.url || "",
    };
  } catch (error) {
    console.error("❌ Lỗi khi kiểm tra lời mời làm quản trị viên:", error);
    throw { status: 500, message: "Lỗi máy chủ" };
  }
};

const getInvitableFriends = async (groupId, userId) => {
  try {
    const user = await User.findById(userId).populate("friends", "displayName avt");
    const group = await Group.findById(groupId).populate("members.idUser", "_id");

    if (!user || !group) {
      return null;
    }

    const groupMemberIds = group.members.map(member => member.idUser._id.toString());

    const invitableFriends = await Promise.all(
      user.friends
        .filter(friend => !groupMemberIds.includes(friend._id.toString()))
        .map(async friend => {
          const avatar = await MyPhoto.findById(friend.avt).select("url");
          return {
            _id: friend._id,
            displayName: friend.displayName,
            avt: avatar ? avatar.url : null,
          };
        })
    );

    return invitableFriends;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách bạn bè có thể mời:", error);
    throw error;
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
  deleteRuleFromGroup,
  getPendingMembers,
  updateMemberStatus,
  getGroupMembers,
  getUserApprovedArticles,
  checkAdminInvite,
  getInvitableFriends
};
