import express from 'express';
import HistoryArticleController from '../controllers/historyArticleController.js';

const Router = express.Router();

Router.get('/', HistoryArticleController.getHistoryArticles);
Router.get('/:id', HistoryArticleController.getHistoryArticleById);
Router.post('/', HistoryArticleController.createHistoryArticle);
Router.patch('/:id', HistoryArticleController.updateHistoryArticleById);
Router.patch('/', HistoryArticleController.updateAllHistoryArticles);
Router.delete('/:id', HistoryArticleController.deleteHistoryArticleById);

export const historyArticledRoute = Router;
