import Trip from '../models/Trip.js';

const getTrips = async () => {
    return await Trip.find({ deleteAt: null })
  };

  const getTripById = async (id) => {
    return await Trip.findOne({ _id: id, deleteAt: null }) 
  };

const createTrip = async (data) => {
  return await Trip.create(data);
};

const updateTripById = async (id, data) => {
    return await Trip.findByIdAndUpdate(id, data, { new: true })
};

const updateAllTrips = async (data) => {
  return await Trip.updateMany({}, data, { new: true });
};

const deleteTripById = async (id) => {
  return await Trip.findByIdAndUpdate(id, { deleteAt: Date.now() }, { new: true });
};

export const tripService = {
  getTrips,
  getTripById,
  createTrip,
  updateTripById,
  updateAllTrips,
  deleteTripById,
};
