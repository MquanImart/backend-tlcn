import User from "../models/User.js";

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

export const userService = {
  getUsers,
  getUserById,
  createUser,
  updateUserById,
  updateAllUsers,
  deleteUserById,
};
