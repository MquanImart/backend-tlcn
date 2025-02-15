import express from 'express';
import ReelsController from '../controllers/reelsController.js';

const Router = express.Router();

Router.get('/', ReelsController.getReels);
Router.get('/:id', ReelsController.getReelsById);
Router.post('/', ReelsController.createReels);
Router.patch('/:id', ReelsController.updateReelsById);
Router.patch('/', ReelsController.updateAllReels);
Router.delete('/:id', ReelsController.deleteReelsById);

export const reelsRoute = Router;
