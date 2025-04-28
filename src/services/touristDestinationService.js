import TouristDestination from "../models/TouristDestination.js";

const getAll = async () => {
    return await TouristDestination.find();
};

const getById = async (id) => {
    return await TouristDestination.findById(id);
};

const createTouristDestination = async (data) => {
    return await TouristDestination.create(data)
}

const updateTouristDestinationById = async (id, data) => {
    return await TouristDestination.findByIdAndUpdate(id, data, { new: true })
}

const updateAllTouristDestinations = async (data) => {
    return await TouristDestination.updateMany({}, data, { new: true })
}

const deleteTouristDestinationById = async (id) => {
    return await TouristDestination.findByIdAndDelete(id)
}

const touristDestinationService = {
    getAll,
    getById,
    createTouristDestination,
    updateTouristDestinationById,
    updateAllTouristDestinations,
    deleteTouristDestinationById,
}

export default touristDestinationService;