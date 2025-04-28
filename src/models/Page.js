import mongoose from 'mongoose';
import User from './User.js';
import MyPhoto from './MyPhoto.js';
import Address from './Address.js';
import Article from './Article.js';
import Ticket from './Ticket.js';
import Hobby from './Hobby.js';
import suggestTouristData from '../AI-algorithms/OpenAI-reply-format/suggestTouristData.js';

const { Schema } = mongoose;

const pageSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  avt: {
    type: Schema.Types.ObjectId,
    ref: 'MyPhoto',
  },
  address: {
    type: Schema.Types.ObjectId,
    ref: 'Address',
  },
  follower: [{
    type: Schema.Types.ObjectId,
    ref: 'User', 
  }],
  timeOpen: {
    type: String,
    trim: true,
  },
  timeClose: {
    type: String,
    trim: true,
  },
  listArticle: [{
    type: Schema.Types.ObjectId,
    ref: 'Article', 
  }],
  idCreater: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  listAdmin: [{
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
      type: Number,
      default: () => Date.now(),
    },
  }],
  listTicket: [{
    type: Schema.Types.ObjectId,
    ref: 'Ticket',
  }],
  hobbies: [{
    type: Schema.Types.ObjectId,
    ref: 'Hobby', 
  }],
  createdAt: {
    type: Number,
    default: () => Date.now(),
  },
  updatedAt: {
    type: Number,
    default: () => Date.now()
  },
  deleteAt: {
    type: Number,
    default: null,
  },
});

const Page = mongoose.model('Page', pageSchema);
export default Page;

// pageSchema.post('save', async function(doc, next) {
//   try {
//     const suggestion = await suggestTouristData(doc.name);

//     // Parse dữ liệu từ AI trả về
//     const match = suggestion.match(/\[(.*?)\]/g);
//     const province = match && match[0] ? JSON.parse(match[0]) : [];
//     const bestMonths = match && match[1] ? JSON.parse(match[1]) : [];
//     const tags = match && match[2] ? JSON.parse(match[2]) : [];

//     const touristDestination = new TouristDestination({
//       name: doc.name,
//       pageId: doc._id,
//       province: province, // Bạn có thể lấy từ Address nếu cần
//       best_months: bestMonths,
//       tags: tags,
//       coordinates: [0, 0], // Update sau nếu có Address
//     });

//     await touristDestination.save();
//     next();
//   } catch (err) {
//     console.error('Error creating TouristDestination after Page creation:', err);
//     next(err);
//   }
// });