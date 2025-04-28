// recentViewController.js
import recentViewService from '../services/recentViewService.js'

const getRecentViews = async (req, res) => {
  try {
    const recentViews = await recentViewService.getRecentViews()
    res.status(200).json({ success: true, data: recentViews, message: 'Lấy danh sách lượt xem gần đây thành công' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const getRecentViewById = async (req, res) => {
  try {
    const recentView = await recentViewService.getRecentViewById(req.params.id)
    if (!recentView) return res.status(404).json({ success: false, data: null, message: 'Lượt xem gần đây không tồn tại' })
    res.status(200).json({ success: true, data: recentView, message: 'Lấy lượt xem gần đây thành công' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const createRecentView = async (req, res) => {
  try {
    const newRecentView = await recentViewService.createRecentView(req.body)
    res.status(201).json({ success: true, data: newRecentView, message: 'Tạo lượt xem gần đây thành công' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const updateRecentViewById = async (req, res) => {
  try {
    const updatedRecentView = await recentViewService.updateRecentViewById(req.params.id, req.body)
    if (!updatedRecentView) return res.status(404).json({ success: false, data: null, message: 'Lượt xem gần đây không tồn tại' })
    res.status(200).json({ success: true, data: updatedRecentView, message: 'Cập nhật lượt xem gần đây thành công' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const updateAllRecentViews = async (req, res) => {
  try {
    const updatedRecentViews = await recentViewService.updateAllRecentViews(req.body)
    res.status(200).json({ success: true, data: updatedRecentViews, message: 'Cập nhật tất cả lượt xem gần đây thành công' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const deleteRecentViewById = async (req, res) => {
  try {
    const deletedRecentView = await recentViewService.deleteRecentViewById(req.params.id)
    if (!deletedRecentView) return res.status(404).json({ success: false, data: null, message: 'Lượt xem gần đây không tồn tại' })
    res.status(200).json({ success: true, data: null, message: 'Xóa lượt xem gần đây thành công' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

export default {
  getRecentViews,
  getRecentViewById,
  createRecentView,
  updateRecentViewById,
  updateAllRecentViews,
  deleteRecentViewById
}
