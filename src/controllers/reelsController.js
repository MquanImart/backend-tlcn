import reelsService from '../services/reelsService.js'

const getReels = async (req, res) => {
  try {
    const Reels = await reelsService.getAll()
    res.status(200).json({ success: true, data: Reels, message: 'Lấy danh sách reels thành công' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const getReelsById = async (req, res) => {
  try {
    const Reels = await reelsService.getById(req.params.id)
    if (!Reels) return res.status(404).json({ success: false, data: null, message: 'Reels không tồn tại' })
    res.status(200).json({ success: true, data: Reels, message: 'Lấy reels thành công' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const createReels = async (req, res) => {
  try {
    const newReels = await reelsService.createReels(req.body)
    res.status(201).json({ success: true, data: newReels, message: 'Tạo reels thành công' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const updateReelsById = async (req, res) => {
  try {
    const updatedReels = await reelsService.updateReelsById(req.params.id, req.body)
    if (!updatedReels) return res.status(404).json({ success: false, data: null, message: 'Reels không tồn tại' })
    res.status(200).json({ success: true, data: updatedReels, message: 'Cập nhật reels thành công' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const updateAllReels = async (req, res) => {
  try {
    const updatedReels = await reelsService.updateAllReels(req.body)
    res.status(200).json({ success: true, data: updatedReels, message: 'Cập nhật tất cả reels thành công' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const deleteReelsById = async (req, res) => {
  try {
    const deletedReels = await reelsService.deleteReelsById(req.params.id)
    if (!deletedReels) return res.status(404).json({ success: false, data: null, message: 'Reels không tồn tại' })
    res.status(200).json({ success: true, data: null, message: 'Xóa reels thành công' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const ReelsController = {
  getReels,
  getReelsById,
  createReels,
  updateReelsById,
  updateAllReels,
  deleteReelsById,
}

export  default ReelsController;