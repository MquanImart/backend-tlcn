import Message from '../models/Message.js';

const getAll = async () => {
    return await Message.find();
};

const getById = async (id) => {
    return await Message.findById(id);
};

const createMessage = async (data) => {
    return await Message.create(data)
}

const updateMessageById = async (id, data) => {
    return await Message.findByIdAndUpdate(id, data, { new: true })
}

const updateAllMessages = async (data) => {
    return await Message.updateMany({}, data, { new: true })
}

const deleteMessageById = async (id) => {
    return await Message.findByIdAndDelete(id)
}

const MessageService = {
    getAll,
    getById,
    createMessage,
    updateMessageById,
    updateAllMessages,
    deleteMessageById,
}

export default MessageService;