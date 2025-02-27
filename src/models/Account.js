import mongoose from 'mongoose'

const accountSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    //required: true,
    //unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  warningLevel: {
    type: Number,
    default: 0,
  },
  state: {
    type: String,
    enum: ['online', 'offline'],
    default: 'offline',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,
  _destroy: {
    type: Date,
    default: null,
  },
})

const Account = mongoose.model('Account', accountSchema)
export default Account
