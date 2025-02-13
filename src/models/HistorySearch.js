import mongoose from 'mongoose';
import User from './User.js';

const { Schema } = mongoose;

const historySearchSchema = new Schema({
  idUser: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  keySearch: [{
    type: String,
    required: true,
  }],
  data: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  _destroy: {
    type: Date,
    default: null,
  },
});

const HistorySearch = mongoose.model('HistorySearch', historySearchSchema);
export default HistorySearch;
