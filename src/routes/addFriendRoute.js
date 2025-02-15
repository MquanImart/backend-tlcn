import express from 'express';
import AddFriendController from '../controllers/addFriendController.js';

const Router = express.Router();

Router.get('/', AddFriendController.getAddFriends);
Router.get('/:id', AddFriendController.getAddFriendById);
Router.post('/', AddFriendController.createAddFriend);
Router.patch('/:id', AddFriendController.updateAddFriendById);
Router.patch('/', AddFriendController.updateAllAddFriends);
Router.delete('/:id', AddFriendController.deleteAddFriendById);

export const addFriendRoute = Router;
