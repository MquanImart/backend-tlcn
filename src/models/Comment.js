import mongoose from 'mongoose';
import User from './User.js';
import MyPhoto from './MyPhoto.js';

const { Schema } = mongoose;

const commentSchema = new Schema({
  _iduser: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  img: [{
    type: Schema.Types.ObjectId,
    ref: 'MyPhoto', 
  }],
  replyComment: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment',
  }],  
  emoticons: [{
    type: Schema.Types.ObjectId,
    ref: 'User', 
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
  _destroy: {
    type: Date,
    default: null,
  },
});

const Comment = mongoose.model('Comment', commentSchema);
export default Comment;
