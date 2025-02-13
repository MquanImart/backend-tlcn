import mongoose from 'mongoose';
import Address from './Address.js';

const { Schema } = mongoose;

const tripSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  startAddress: {
    type: Schema.Types.ObjectId,
    ref: 'Address', 
    required: true,
  },
  listAddress: [{
    type: Schema.Types.ObjectId,
    ref: 'Address', 
  }],
  endAddress: {
    type: Schema.Types.ObjectId,
    ref: 'Address',
    required: true,
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: null,
  },
  deleteAt: {
    type: Date,
    default: null,
  },
});

const Trip = mongoose.model('Trip', tripSchema);
export default Trip;
