import mongoose from 'mongoose';
import Account from './Account.js';
import Address from './Address.js';
import Identification from './Identification.js';
import MyPhoto from './MyPhoto.js';
import Trip from './Trip.js';
import Hobby from './Hobby.js';

const { Schema } = mongoose;

const userSchema = new Schema({
  account: {
    type: Schema.Types.ObjectId,
    ref: 'Account', 
    required: true,
  },
  identification: {
    type: Schema.Types.ObjectId,
    ref: 'Identification', 
    required: true,
  },
  displayName: {
    type: String,
    required: true,
    trim: true,
  },
  hashtag: {
    type: String,
    trim: true,
  },
  address: {
    type: Schema.Types.ObjectId,
    ref: 'Address', 
    required: true,
  },
  avt: [{
    type: Schema.Types.ObjectId,
    ref: 'MyPhoto', 
  }],
  aboutMe: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  hobbies: [{
    type: String,
  }],
  friends: [{
    type: Schema.Types.ObjectId,
    ref: 'User', 
  }],
  articles: [{
    type: Schema.Types.ObjectId,
    ref: 'Article',
  }],
  reels: [{
    type: Schema.Types.ObjectId,
    ref: 'Reels',
  }],
  pages: {
    _id: {
      type: String,
    },
    createPages: [{
      type: Schema.Types.ObjectId,
      ref: 'Page',
    }],
    followerPages: [{
      type: Schema.Types.ObjectId,
      ref: 'Page', 
    }],
  },
  saveAddress: [{
    type: Schema.Types.ObjectId,
    ref: 'Address', // Liên kết với Address model
  }],
  trips: [{
    type: Schema.Types.ObjectId,
    ref: 'Trip', // Liên kết với Trip model
  }],
  collections: [{
    type: Schema.Types.ObjectId,
    ref: 'Collection', // Liên kết với Collection model
  }],
  groups: {
    _id: {
      type: String,
    },
    createGroups: [{
      type: Schema.Types.ObjectId,
      ref: 'Group', // Liên kết với Group model
    }],
    saveGroups: [{
      type: Schema.Types.ObjectId,
      ref: 'Group', // Liên kết với Group model
    }],
  },
  follow: [{
    type: Schema.Types.ObjectId,
    ref: 'User', // Danh sách người dùng được follow
  }],
  setting: {
    profileVisibility: {
      type: Boolean,
      default: true,
    },
    allowMessagesFromStrangers: {
      type: Boolean,
      default: true,
    },
  },
});

const User = mongoose.model('User', userSchema);
export default User;
