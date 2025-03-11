import mongoose, { Schema } from 'mongoose';

const AddFriendSchema = new Schema(
  {
    senderId: { type: String, required: true },
    receiverId: { type: String, required: true },
    status: {
      type: String,
      enum: ['approved', 'pending', 'rejected'],
      default: 'pending',
    },
    message: { type: String, required: false },
    createdAt: { type: Number, default: () => Date.now() },
    acceptedAt: { type: Number, required: false },
  }
);

const AddFriend = mongoose.model('AddFriend', AddFriendSchema);
export default AddFriend;