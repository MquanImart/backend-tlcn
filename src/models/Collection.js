import mongoose, { Schema } from 'mongoose';

const CollectionSchema = new Schema(
  {
    name: { type: String, required: true },
    items: { type: [String], required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    _destroy: { type: Date, required: false },
    type: {
      type: String,
      enum: ['article', 'reels'],
      required: true,
    },
  }
);

const Collection = mongoose.model('Collection', CollectionSchema);
export default Collection;