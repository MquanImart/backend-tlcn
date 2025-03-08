import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema(
  {
    conversationId: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation", required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: {
      contentType: { type: String, enum: ['img', 'video', 'text', 'record'], required: true }, // Đổi từ 'type' thành 'contentType'
      message: { type: String, required: function() { return this.contentType === 'text'; } }, // Chỉ bắt buộc nếu là 'text'
      mediaUrl: { type: String, required: function() { return this.contentType !== 'text'; } } // Bắt buộc nếu là 'img', 'video' hoặc 'record'
    },
    seenBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const Message = mongoose.model('Message', MessageSchema);
export default Message;
