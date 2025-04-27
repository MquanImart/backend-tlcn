import mongoose, { Schema, Document } from 'mongoose';

const HistoryArticleSchema = new Schema({
  idUser: { type: String, required: true },
  idArticle: { type: String, required: true },
  action: {
    type: String,
    enum: ['View', 'Like'], // Giới hạn giá trị hợp lệ
    default: 'View',
  },
  viewDate: { type: Number, default: () => Date.now() },
});

const HistoryArticle = mongoose.model('HistoryArticle', HistoryArticleSchema);
export default HistoryArticle;