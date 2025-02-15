import express from 'express';
import ProvideController from '../controllers/provideController.js';

const Router = express.Router();

Router.get('/', ProvideController.getProvides);
Router.get('/:id', ProvideController.getProvideById);
Router.post('/', ProvideController.createProvide);
Router.patch('/:id', ProvideController.updateProvideById);
Router.patch('/', ProvideController.updateAllProvides);
Router.delete('/:id', ProvideController.deleteProvideById);

export const provideRoute = Router;
