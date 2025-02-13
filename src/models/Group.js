import mongoose from 'mongoose';
import User from './User.js';
import MyPhoto from './MyPhoto.js';
import Article from './Article.js';
import Hobby from './Hobby.js';

const { Schema } = mongoose;

const groupSchema = new Schema({
  warningLevel: {
    type: Number,
    enum: [0, 1, 2, 3],
    required: true,
  },
  groupName: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    enum: ['public', 'private'], 
    required: true,
  },
  idCreater: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  introduction: {
    type: String,
    trim: true,
  },
  avt: {
    type: Schema.Types.ObjectId,
    ref: 'MyPhoto', 
  },
  members: [{
    idUser: {
      type: Schema.Types.ObjectId,
      ref: 'User', 
      required: true,
    },
    state: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'], 
      required: true,
    },
    joinDate: {
      type: Date,
      default: Date.now,
    },
  }],
  article: [{
    idArticle: {
      type: Schema.Types.ObjectId,
      ref: 'Article',
      required: true,
    },
    state: {
      type: String,
      enum: ['approved', 'pending'],
      required: true,
    },
  }],
  rule: [{
    type: String,
  }],
  Administrators: [{
    idUser: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    state: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'], 
      required: true,
    },
    joinDate: {
      type: Date,
      default: Date.now,
    },
  }],
  hobbies: [{
    type: Schema.Types.ObjectId,
    ref: 'Hobby', 
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

const Group = mongoose.model('Group', groupSchema);
export default Group;
