import mongoose, { Schema, Document } from 'mongoose';

const HistoryArticleSchema = new Schema({
  idUser: { type: String, required: true },
  idArticle: { type: String, required: true },
  viewDate: { type: String, default: Date.now },
});

const HistoryArticle = mongoose.model('HistoryArticle', HistoryArticleSchema);
export default HistoryArticle;
