import mongoose from 'mongoose';
import User from './User.js';

const { Schema } = mongoose;

const notificationSchema = new Schema({
  senderId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  receiverId: {
    type: Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
  message: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    enum: ['read', 'unread'], 
    default: 'unread', 
  },
  url: {
    type: String,
    trim: true,
  },
  readAt: {
    type: Number,
    default: null,
  },
  createdAt: {
    type: Number,
    default: Date.now,
  },
  _destroy: {
    type: Number,
    default: null, // Hỗ trợ soft delete
  },
});

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
