import mongoose, { Schema } from 'mongoose';

const ReelsSchema = new Schema({
  createdBy: { type: String, required: true },
  reports: { type: [String], default: [] },
  content: { type: String, required: true },
  address: { type: String },
  hashTag: { type: [String], default: [] },
  photo: { type: String, required: true },
  scope: { type: String },
  emoticons: { type: [String], default: [] },
  comments: { type: [String], default: [] },
  createdAt: { type: Number, required: true, default: Date.now },
  updatedAt: { type: Number, default: Date.now },
  destroyAt: { type: Number, default: null }
});

const Reels = mongoose.model('Reels', ReelsSchema);
export default Reels;
