import Provide from '../models/Provide.js';

const getAll = async () => {
    return await Provide.find();
};

const getById = async (id) => {
    return await Provide.findById(id);
};

const createProvide = async (data) => {
    return await Provide.create(data)
}

const updateProvideById = async (id, data) => {
    return await Provide.findByIdAndUpdate(id, data, { new: true })
}

const updateAllProvides = async (data) => {
    return await Provide.updateMany({}, data, { new: true })
}

const deleteProvideById = async (id) => {
    return await Provide.findByIdAndDelete(id)
}

const provideService = {
    getAll,
    getById,
    createProvide,
    updateProvideById,
    updateAllProvides,
    deleteProvideById,
}

export default provideService;