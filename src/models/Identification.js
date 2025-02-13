import mongoose from 'mongoose';

const { Schema } = mongoose;

const identificationSchema = new Schema({
  number: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  dateOfBirth: {
    type: String,
    required: true,
  },
  sex: {
    type: String,
    required: true,
    enum: ['male', 'female', 'other'], 
  },
  nationality: {
    type: String,
    required: true,
    trim: true,
  },
  placeOfOrigin: {
    type: String,
    trim: true,
  },
  placeOfResidence: {
    type: String,
    trim: true,
  },
  dateOfExpiry: {
    type: String,
    trim: true,
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
    default: null, // Hỗ trợ soft delete
  },
});

const Identification = mongoose.model('Identification', identificationSchema);
export default Identification;
