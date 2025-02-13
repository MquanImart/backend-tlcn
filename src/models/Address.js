import mongoose from 'mongoose';

const { Schema } = mongoose;

const addressSchema = new Schema({
  province: {
    type: String,
    required: true,
    trim: true,
  },
  district: {
    type: String,
    required: true,
    trim: true,
  },
  ward: {
    type: String,
    required: true,
    trim: true,
  },
  street: {
    type: String,
    required: true,
    trim: true,
  },
  placeName: {
    type: String,
    trim: true,
  },
  lat: {
    type: Number,
  },
  long: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: null,
  },
  _destroy: {
    type: Date,
    default: null,
  },
});

const Address = mongoose.model('Address', addressSchema);
export default Address;
