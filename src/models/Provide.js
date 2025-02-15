import mongoose, { Schema } from 'mongoose';

const ProvideSchema = new Schema({
  name: { type: String, required: true },
  avt: { type: String, required: true },
  listPage: { type: [String], default: [] }, 
});

const Provide = mongoose.model('Provide', ProvideSchema);
export default Provide;
