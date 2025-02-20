import mongoose from 'mongoose';
import User from './User.js';
import Report from './Report.js';
import Group from './Group.js';
import Address from './Address.js';
import MyPhoto from './MyPhoto.js';
import Comment from './Comment.js';

const { Schema } = mongoose;

const articleSchema = new Schema({
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
  sharedPostId: {
    type: Schema.Types.ObjectId,
    ref: 'Article', 
  },
  reports: [{
    type: Schema.Types.ObjectId,
    ref: 'Report',
  }],
  groupID: {
    type: Schema.Types.ObjectId,
    ref: 'Group',
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    type: Schema.Types.ObjectId,
    ref: 'Address',
  },
  hashTag: [{
    type: String,
  }],
  listPhoto: [{
    type: Schema.Types.ObjectId,
    ref: 'MyPhoto', 
  }],
  scope: {
    type: String,
    trim: true,
  },
  emoticons: [{
    type: Schema.Types.ObjectId,
    ref: 'User', 
  }],
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment',
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
    default: null, // Hỗ trợ soft delete
  },
});

const Article = mongoose.model('Article', articleSchema);
export default Article;
