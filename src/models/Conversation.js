import mongoose, { Schema } from 'mongoose';

const ConversationSchema = new Schema(
  {
    type: {
      type: String,
      enum: ['friend', 'group', 'page'],
      required: true,
    },
    _user: [
      {
        type: {
          type: String, 
          enum: ['user', 'page'],
          required: true,
        },
        _id: { type: String, required: true },
      },
    ],
    content: [
      {
        userId: { type: String, required: true },
        message: { type: String, required: true },
        sendDate: { type: Number, default: Date.now },
      },
    ],
  }
);

const Conversation = mongoose.model('Conversation', ConversationSchema);
export default Conversation;
