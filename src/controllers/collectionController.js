import collectionService from '../services/collectionService.js'

const getCollections = async (req, res) => {
  try {
    const Collections = await collectionService.getAll()
    res.status(200).json({ success: true, data: Collections, message: 'Lấy danh sách bộ sưu tập thành công' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const getCollectionById = async (req, res) => {
  try {
    const Collection = await collectionService.getById(req.params.id)
    if (!Collection) return res.status(404).json({ success: false, data: null, message: 'Bộ sưu tập không tồn tại' })
    res.status(200).json({ success: true, data: Collection, message: 'Lấy bộ sưu tập thành công' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const createCollection = async (req, res) => {
  try {
    const newCollection = await collectionService.createCollection(req.body)
    res.status(201).json({ success: true, data: newCollection, message: 'Tạo bộ sưu tập thành công' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const updateCollectionById = async (req, res) => {
  try {
    const updatedCollection = await collectionService.updateCollectionById(req.params.id, req.body)
    if (!updatedCollection) return res.status(404).json({ success: false, data: null, message: 'Bộ sưu tập không tồn tại' })
    res.status(200).json({ success: true, data: updatedCollection, message: 'Cập nhật bộ sưu tập thành công' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const updateAllCollections = async (req, res) => {
  try {
    const updatedCollections = await collectionService.updateAllCollections(req.body)
    res.status(200).json({ success: true, data: updatedCollections, message: 'Cập nhật tất cả bộ sưu tập thành công' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const deleteCollectionById = async (req, res) => {
  try {
    const deletedCollection = await collectionService.deleteCollectionById(req.params.id)
    if (!deletedCollection) return res.status(404).json({ success: false, data: null, message: 'Bộ sưu tập không tồn tại' })
    res.status(200).json({ success: true, data: null, message: 'Xóa bộ sưu tập thành công' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const CollectionController = {
  getCollections,
  getCollectionById,
  createCollection,
  updateCollectionById,
  updateAllCollections,
  deleteCollectionById,
}

export  default CollectionController;