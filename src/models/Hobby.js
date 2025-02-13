import mongoose from 'mongoose';

const { Schema } = mongoose;

const hobbySchema = new Schema({
  name: {
    type: String,
    required: true,
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
    default: null, 
  },
});

const Hobby = mongoose.model('Hobby', hobbySchema);
export default Hobby;
