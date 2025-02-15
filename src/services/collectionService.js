import Collection from '../models/Collection.js';

const getAll = async () => {
    return await Collection.find();
};

const getById = async (id) => {
    return await Collection.findById(id);
};

const createCollection = async (data) => {
    return await Collection.create(data)
}

const updateCollectionById = async (id, data) => {
    return await Collection.findByIdAndUpdate(id, data, { new: true })
}

const updateAllCollections = async (data) => {
    return await Collection.updateMany({}, data, { new: true })
}

const deleteCollectionById = async (id) => {
    return await Collection.findByIdAndDelete(id)
}

const collectionService = {
    getAll,
    getById,
    createCollection,
    updateCollectionById,
    updateAllCollections,
    deleteCollectionById,
}

export default collectionService;