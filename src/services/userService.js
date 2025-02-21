import User from "../models/User.js";
import Group from "../models/Group.js";
import { groupService } from "./groupService.js";
import { articleService } from "./articleService.js";

const getUsers = async () => {
  return await User.find()
};

const getUserById = async (id) => {
  return await User.findOne({ _id: id })
};

const createUser = async (data) => {
  return await User.create(data);
};

const updateUserById = async (id, data) => {
  return await User.findByIdAndUpdate(id, data, { new: true })
};

const updateAllUsers = async (data) => {
  return await User.updateMany({}, data, { new: true });
};

const deleteUserById = async (id) => {
  return await User.findByIdAndUpdate(id, { deleteAt: Date.now() }, { new: true });
};

const getSavedGroups = async (userId) => {
  const user = await User.findById(userId);

  if (!user || !user.groups?.saveGroups) {
    return [];
  }

  const savedGroupIds = user.groups.saveGroups.map((group) => group._id);
  const savedGroups = await Promise.all(savedGroupIds.map(groupService.getGroupById)); 

  return savedGroups.filter((group) => group !== null); // Lọc nhóm hợp lệ
};

const getMyGroups = async (userId) => {
  const user = await User.findById(userId);

  if (!user || !user.groups?.createGroups) {
    return [];
  }

  const savedGroupIds = user.groups.createGroups.map((group) => group._id);
  const savedGroups = await Promise.all(savedGroupIds.map(groupService.getGroupById)); 

  return savedGroups.filter((group) => group !== null); 
};

const getNotJoinedGroups = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) return [];

    const joinedGroupIds = new Set([
      ...(user.groups?.createGroups?.map((group) => group._id.toString()) || []),
      ...(user.groups?.saveGroups?.map((group) => group._id.toString()) || []),
    ]);

    const allGroups = await groupService.getGroups(); 

    const notJoinedGroupIds = allGroups
      .map(group => group._id.toString())
      .filter(groupId => !joinedGroupIds.has(groupId));

    const notJoinedGroups = await Promise.all(notJoinedGroupIds.map(groupService.getGroupById));

    return notJoinedGroups.filter(group => group !== null);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách nhóm chưa tham gia:", error);
    throw new Error(error.message);
  }
}

const getArticleAllGroups = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("Người dùng không tồn tại");
    }

    const savedGroupIds = user.groups?.saveGroups?.map(group => group._id) || [];
    const myGroupIds = user.groups?.createGroups?.map(group => group._id) || [];
    const groupIds = [...savedGroupIds, ...myGroupIds];

    if (!groupIds.length) {
      return [];
    }

    const groups = await Group.find({ _id: { $in: groupIds }, _destroy: null })

    const approvedArticleIds = groups.flatMap(group =>
      group.article
        ?.filter(article => article.state === "approved") 
        .map(article => article.idArticle._id) || []
    );
  
    if (!approvedArticleIds.length) {
      return [];
    }

    const approvedArticles = await Promise.all(
      approvedArticleIds.map(articleId => articleService.getArticleById(articleId))
    );

    return approvedArticles.filter(article => article !== null);

  } catch (error) {
    console.error("Lỗi khi lấy bài viết đã duyệt:", error);
    throw new Error(error.message);
  }
};
  
export const userService = {
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
};
