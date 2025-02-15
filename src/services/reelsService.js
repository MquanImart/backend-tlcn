import Reels from '../models/Reels.js';

const getAll = async () => {
    return await Reels.find();
};

const getById = async (id) => {
    return await Reels.findById(id);
};

const createReels = async (data) => {
    return await Reels.create(data)
}

const updateReelsById = async (id, data) => {
    return await Reels.findByIdAndUpdate(id, data, { new: true })
}

const updateAllReels = async (data) => {
    return await Reels.updateMany({}, data, { new: true })
}

const deleteReelsById = async (id) => {
    return await Reels.findByIdAndDelete(id)
}

const reelsService = {
    getAll,
    getById,
    createReels,
    updateReelsById,
    updateAllReels,
    deleteReelsById,
}

export default reelsService;