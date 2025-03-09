import Conversation from '../models/Conversation.js'
import Message from '../models/Message.js';
import MyPhoto from '../models/MyPhoto.js'
import { cloudStorageService } from "../config/cloudStorage.js";

const getAll = async () => {
    return await Message.find();
};

const getById = async (id) => {
    return await Message.findById(id);
};

const createMessage = async (data, file) => {
    const { conversationId, sender, type, message } = data;

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
        throw new Error("Không có cuộc trò chuyện phù hợp!");
    }

    let newFile;
    if (type !== 'text'){

        if (!file || !file.buffer) {
            throw new Error("Không có file hợp lệ để upload!");
        }

        newFile = await MyPhoto.create({
            name: file.originalname,
            idAuthor: sender,
            type: type,
            url: "",
        });

        const destination = `src/images/conversations/${conversationId}/${newFile._id}/${Date.now()}`;

        const fileUrl = await cloudStorageService.uploadImageBufferToStorage(
          file.buffer,
          destination,
          file.mimetype
        );

        if (!fileUrl) {
          throw new Error("Không lấy được URL sau khi upload!");
        }

        newFile.url = fileUrl;
        await newFile.save();
    }

    return await Message.create({
        conversationId: conversationId,
        sender: sender,
        content: {
            contentType: type,
            message: type === 'text'? message : null,
            mediaUrl: type !== 'text'? newFile._id : null,
        }
    })
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

const getMessagesByConversationId = async (conversationId) => {
    return await Message.find({conversationId: conversationId});
}

const getPhotosByConversation = async (conversationId) => {
    try {

      const messages = await Message.find({
        conversationId,
        'content.contentType': { $ne: 'text' },
        'content.mediaUrl': { $ne: null }
      }).select('content.mediaUrl');
  
      const mediaIds = messages.map(msg => msg.content.mediaUrl);
  
      if (mediaIds.length === 0) return [];
  
      const photos = await MyPhoto.find({ _id: { $in: mediaIds } });
  
      return {success: true, data: photos};
    } catch (error) {
      return {success: false, data: []};
    }
  };

const messageService = {
    getAll,
    getById,
    createMessage,
    updateMessageById,
    updateAllMessages,
    deleteMessageById,
    getMessagesByConversationId,
    getPhotosByConversation
}

export default messageService;