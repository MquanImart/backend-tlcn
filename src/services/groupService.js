import Group from "../models/Group.js";

const getGroups = async () => {
  return await Group.find({ _destroy: null })
};

const getGroupById = async (id) => {
  return await Group.findOne({ _id: id, _destroy: null })
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

export const groupService = {
  getGroups,
  getGroupById,
  createGroup,
  updateGroupById,
  updateAllGroups,
  deleteGroupById,
};
