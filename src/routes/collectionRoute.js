import express from 'express';
import CollectionController from '../controllers/collectionController.js';

const Router = express.Router();

Router.get('/', CollectionController.getCollections);
Router.get('/:id', CollectionController.getCollectionById);
Router.post('/', CollectionController.createCollection);
Router.patch('/:id', CollectionController.updateCollectionById);
Router.patch('/', CollectionController.updateAllCollections);
Router.delete('/:id', CollectionController.deleteCollectionById);

export const collectiondRoute = Router;
