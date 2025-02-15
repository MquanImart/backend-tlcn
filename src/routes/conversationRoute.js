import express from 'express';
import ConversationController from '../controllers/conversationController.js';

const Router = express.Router();

Router.get('/', ConversationController.getConversations);
Router.get('/:id', ConversationController.getConversationById);
Router.post('/', ConversationController.createConversation);
Router.patch('/:id', ConversationController.updateConversationById);
Router.patch('/', ConversationController.updateAllConversations);
Router.delete('/:id', ConversationController.deleteConversationById);

export const conversationdRoute = Router;
