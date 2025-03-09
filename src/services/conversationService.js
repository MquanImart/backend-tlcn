import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import User from '../models/User.js'

const getAll = async () => {
    return await Conversation.find();
};

const getById = async (id) => {
    return await Conversation.findById(id);
};

const createConversation = async (data) => {
    if (!data.lastMessage) return {success: false, message: "Phải có tin nhắn đầu tiên"};

    // Kiểm tra nếu là cuộc trò chuyện riêng tư (private)
    if (data.participants.length === 2) {
      const existingConversation = await Conversation.findOne({
          type: "private",
          participants: { $all: data.participants, $size: 2 }
      });

      if (existingConversation) {
          return { success: false, message: "Cuộc trò chuyện giữa hai người dùng đã tồn tại" };
      }
    }

    const conversation = await Conversation.create({
      participants: data.participants,
      groupName: data.groupName,
      avtGroup: data.avtGroup,
      pageId: data.pageId
    })
    if (!conversation) return {success: false, message: "Không thể tạo hộp thoại"};

    const message = await Message.create({
      conversationId: conversation._id,
      sender: data.lastMessage.sender,
      content: {
        contentType: data.lastMessage.contentType,
        message: data.lastMessage.message,
        mediaUrl: data.lastMessage.mediaUrl
      },
      seenBy: []
    })
    if (!message) return {success: false, message: "Không thể tạo tin nhắn"};

    const updateConversation = await Conversation.findByIdAndUpdate(message.conversationId, {
      lastMessage: message._id,
      updateAt: Date.now()
    }, { new: true })

    if (!updateConversation) return {success: false, message: "Không thể thêm tin nhắn"};
    
    return {success: true, data: updateConversation, message: "Thành công tạo hộp thoại"};
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

const getConversationOfUser = async (userId) => {
  try {
    const user = await User.findById(userId).select("friends").lean();
    if (!user) return {success: false, message: 'Không tìm thấy người dùng'};

    const conversations = await Conversation.find({
      participants: userId,
    })
      .populate("participants", "_id displayName avt")
      .populate({
        path: "lastMessage",
        select: "_id sender content seenBy createAt"
      })
      .lean();       
    
    return {user, conversations};
    
  } catch (error) {
      return { user, conversation: []};
  }
};

const getConversationsFiltered = async (userId, filterByFriends) => {
  try {
    const { user, conversations } = await getConversationOfUser(userId);
    const filteredConversations = conversations.filter((conversation) => {
      if (conversation.type === "private") {
        // Lấy participant còn lại
        const otherParticipant = conversation.participants.find(
          (p) => p._id.toString() !== userId.toString()
        );
        // Nếu không có participant còn lại, bỏ qua hội thoại
        if (!otherParticipant) return false;

        // Kiểm tra xem participant còn lại có trong danh sách bạn bè không
        const isFriend = user.friends.some(
          (friendId) => friendId.toString() === otherParticipant._id.toString()
        );

        return filterByFriends ? isFriend : !isFriend;
      }
      return filterByFriends;
    });

    return { success: true, data: filteredConversations };
  } catch (error) {
    return { success: false, message: "Có lỗi xảy ra trong quá trình lấy dữ liệu" };
  }
};

const getConversationFriends = async (userId) => {
  return await getConversationsFiltered(userId, true);
};

const getConversationWithoutFriends = async (userId) => {
  return await getConversationsFiltered(userId, false);
};

const getFriendsWithoutPrivateChat = async (userId) => {
  try {

    const user = await User.findById(userId).select("friends").lean();
    if (!user || !user.friends || user.friends.length === 0) {
      return { success: true, friendsWithoutPrivateChat: [] };
    }

    const privateChats = await Conversation.find({
      type: "private",
      participants: userId,
    })
      .select("participants")
      .lean();

    const usersWithPrivateChat = new Set();
    privateChats.forEach((chat) => {
      chat.participants.forEach((participant) => {
        if (participant.toString() !== userId) {
          usersWithPrivateChat.add(participant.toString());
        }
      });
    });

    const friendsWithoutPrivateChat = user.friends.filter(
      (friendId) => !usersWithPrivateChat.has(friendId.toString())
    );

    const result = await Promise.all(
      friendsWithoutPrivateChat.map(async (item) => {
        const friend = await User.findById(item);
        return {
          _id: friend._id,
          displayName: friend.displayName,
          avt: friend.avt
        }
      })
    )
    return { success: true, data: result };
  } catch (error) {
    return { success: false, message: "Lỗi server" };
  }
};

const conversationService = {
    getAll,
    getById,
    createConversation,
    updateConversationById,
    updateAllConversations,
    deleteConversationById,
    getConversationFriends,
    getFriendsWithoutPrivateChat,
    getConversationWithoutFriends
}

export default conversationService;