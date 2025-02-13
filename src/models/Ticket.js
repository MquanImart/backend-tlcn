import mongoose from 'mongoose';

const { Schema } = mongoose;

const ticketSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
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
    default: null, 
  },
});

const Ticket = mongoose.model('Ticket', ticketSchema);
export default Ticket;
