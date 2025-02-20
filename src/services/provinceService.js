import Province from '../models/Province.js';

const getAll = async () => {
    return await Province.find();
};

const getById = async (id) => {
    return await Province.findById(id);
};

const createProvince = async (data) => {
    return await Province.create(data)
}

const updateProvinceById = async (id, data) => {
    return await Province.findByIdAndUpdate(id, data, { new: true })
}

const updateAllProvinces = async (data) => {
    return await Province.updateMany({}, data, { new: true })
}

const deleteProvinceById = async (id) => {
    return await Province.findByIdAndDelete(id)
}

const provinceService = {
    getAll,
    getById,
    createProvince,
    updateProvinceById,
    updateAllProvinces,
    deleteProvinceById,
}

export default provinceService;