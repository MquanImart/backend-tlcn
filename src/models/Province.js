import mongoose, { Schema } from 'mongoose';

const ProvinceSchema = new Schema({
  name: { type: String, required: true },
  avt: { type: String, required: true },
  listPage: { type: [String], default: [] }, 
});

const Province = mongoose.model('Province', ProvinceSchema);
export default Province;
