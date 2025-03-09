import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema(
  {
    conversationId: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation", required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: {
      contentType: { type: String, enum: ['img', 'video', 'text', 'record'], required: true },
      message: { type: String, required: false },
      mediaUrl: { type: String, required: false } 
    },
    seenBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    createAt: { type: Number, default: Date.now() },
    updateAt: { type: Number, default: Date.now() }
  }
);

const Message = mongoose.model('Message', MessageSchema);
export default Message;
