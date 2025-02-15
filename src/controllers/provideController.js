import provideService from '../services/provideService.js'

const getProvides = async (req, res) => {
  try {
    const Provides = await provideService.getAll()
    res.status(200).json({ success: true, data: Provides, message: 'Lấy danh sách tỉnh thành công' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const getProvideById = async (req, res) => {
  try {
    const Provide = await provideService.getById(req.params.id)
    if (!Provide) return res.status(404).json({ success: false, data: null, message: 'Tỉnh không tồn tại' })
    res.status(200).json({ success: true, data: Provide, message: 'Lấy tỉnh thành công' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const createProvide = async (req, res) => {
  try {
    const newProvide = await provideService.createProvide(req.body)
    res.status(201).json({ success: true, data: newProvide, message: 'Tạo tỉnh thành công' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const updateProvideById = async (req, res) => {
  try {
    const updatedProvide = await provideService.updateProvideById(req.params.id, req.body)
    if (!updatedProvide) return res.status(404).json({ success: false, data: null, message: 'Tỉnh không tồn tại' })
    res.status(200).json({ success: true, data: updatedProvide, message: 'Cập nhật tỉnh thành công' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const updateAllProvides = async (req, res) => {
  try {
    const updatedProvides = await provideService.updateAllProvides(req.body)
    res.status(200).json({ success: true, data: updatedProvides, message: 'Cập nhật tất cả tỉnh thành công' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const deleteProvideById = async (req, res) => {
  try {
    const deletedProvide = await provideService.deleteProvideById(req.params.id)
    if (!deletedProvide) return res.status(404).json({ success: false, data: null, message: 'Tỉnh không tồn tại' })
    res.status(200).json({ success: true, data: null, message: 'Xóa tỉnh thành công' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const ProvideController = {
  getProvides,
  getProvideById,
  createProvide,
  updateProvideById,
  updateAllProvides,
  deleteProvideById,
}

export  default ProvideController;