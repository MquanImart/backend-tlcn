import conversationService from '../services/conversationService.js'

const getConversations = async (req, res) => {
  try {
    const Conversations = await conversationService.getAll()
    res.status(200).json({ success: true, data: Conversations, message: 'Lấy danh sách cuộc thoại thành công' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const getConversationById = async (req, res) => {
  try {
    const Conversation = await conversationService.getById(req.params.id)
    if (!Conversation) return res.status(404).json({ success: false, data: null, message: 'cuộc thoại không tồn tại' })
    res.status(200).json({ success: true, data: Conversation, message: 'Lấy cuộc thoại thành công' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const createConversation = async (req, res) => {
  try {
    const newConversation = await conversationService.createConversation(req.body)
    res.status(201).json({ success: true, data: newConversation, message: 'Tạo cuộc thoại thành công' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const updateConversationById = async (req, res) => {
  try {
    const updatedConversation = await conversationService.updateConversationById(req.params.id, req.body)
    if (!updatedConversation) return res.status(404).json({ success: false, data: null, message: 'cuộc thoại không tồn tại' })
    res.status(200).json({ success: true, data: updatedConversation, message: 'Cập nhật cuộc thoại thành công' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const updateAllConversations = async (req, res) => {
  try {
    const updatedConversations = await conversationService.updateAllConversations(req.body)
    res.status(200).json({ success: true, data: updatedConversations, message: 'Cập nhật tất cả cuộc thoại thành công' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const deleteConversationById = async (req, res) => {
  try {
    const deletedConversation = await conversationService.deleteConversationById(req.params.id)
    if (!deletedConversation) return res.status(404).json({ success: false, data: null, message: 'cuộc thoại không tồn tại' })
    res.status(200).json({ success: true, data: null, message: 'Xóa cuộc thoại thành công' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const ConversationController = {
  getConversations,
  getConversationById,
  createConversation,
  updateConversationById,
  updateAllConversations,
  deleteConversationById,
}

export  default ConversationController;