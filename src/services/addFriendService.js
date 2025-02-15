import AddFriend from '../models/AddFriend.js';

const getAll = async () => {
    return await AddFriend.find();
};

const getById = async (id) => {
    return await AddFriend.findById(id);
};

const createAddFriend = async (data) => {
    return await AddFriend.create(data)
}

const updateAddFriendById = async (id, data) => {
    return await AddFriend.findByIdAndUpdate(id, data, { new: true })
}

const updateAllAddFriends = async (data) => {
    return await AddFriend.updateMany({}, data, { new: true })
}

const deleteAddFriendById = async (id) => {
    return await AddFriend.findByIdAndDelete(id)
}

const addFriendService = {
    getAll,
    getById,
    createAddFriend,
    updateAddFriendById,
    updateAllAddFriends,
    deleteAddFriendById,
}

export default addFriendService;