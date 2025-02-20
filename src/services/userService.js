import User from "../models/User.js";
import { groupService } from "./groupService.js";

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
export const userService = {
  getUsers,
  getUserById,
  createUser,
  updateUserById,
  updateAllUsers,
  deleteUserById,
  getSavedGroups,
  getMyGroups
};
