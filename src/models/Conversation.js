import mongoose from 'mongoose';

const ConversationSchema = new mongoose.Schema(
  {
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    settings: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        notifications: { type: Boolean, default: true }, 
        muteUntil: { type: Number, default: null }
      },
    ],
    lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
  },
  { timestamps: true }
);

const Conversation = mongoose.model('Conversation', ConversationSchema);
export default Conversation;
