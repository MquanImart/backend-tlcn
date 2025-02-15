import Conversation from '../models/Conversation.js';

const getAll = async () => {
    return await Conversation.find();
};

const getById = async (id) => {
    return await Conversation.findById(id);
};

const createConversation = async (data) => {
    return await Conversation.create(data)
}

const updateConversationById = async (id, data) => {
    return await Conversation.findByIdAndUpdate(id, data, { new: true })
}

const updateAllConversations = async (data) => {
    return await Conversation.updateMany({}, data, { new: true })
}

const deleteConversationById = async (id) => {
    return await Conversation.findByIdAndDelete(id)
}

const conversationService = {
    getAll,
    getById,
    createConversation,
    updateConversationById,
    updateAllConversations,
    deleteConversationById,
}

export default conversationService;