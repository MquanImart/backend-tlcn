import { accountService } from '../services/accountService.js'

const getAccounts = async (req, res) => {
  try {
    const accounts = await accountService.getAccounts()
    res.status(200).json({ success: true, data: accounts, message: 'Lấy danh sách tài khoản thành công' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const getAccountById = async (req, res) => {
  try {
    const account = await accountService.getAccountById(req.params.id)
    if (!account) return res.status(404).json({ success: false, data: null, message: 'Tài khoản không tồn tại' })
    res.status(200).json({ success: true, data: account, message: 'Lấy tài khoản thành công' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const createAccount = async (req, res) => {
  try {
    const newAccount = await accountService.createAccount(req.body)
    res.status(201).json({ success: true, data: newAccount, message: 'Tạo tài khoản thành công' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const updateAccountById = async (req, res) => {
  try {
    const updatedAccount = await accountService.updateAccountById(req.params.id, req.body)
    if (!updatedAccount) return res.status(404).json({ success: false, data: null, message: 'Tài khoản không tồn tại' })
    res.status(200).json({ success: true, data: updatedAccount, message: 'Cập nhật tài khoản thành công' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const updateAllAccounts = async (req, res) => {
  try {
    const updatedAccounts = await accountService.updateAllAccounts(req.body)
    res.status(200).json({ success: true, data: updatedAccounts, message: 'Cập nhật tất cả tài khoản thành công' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const deleteAccountById = async (req, res) => {
  try {
    const deletedAccount = await accountService.deleteAccountById(req.params.id)
    if (!deletedAccount) return res.status(404).json({ success: false, data: null, message: 'Tài khoản không tồn tại' })
    res.status(200).json({ success: true, data: null, message: 'Xóa tài khoản thành công' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

export const accountController = {
  getAccounts,
  getAccountById,
  createAccount,
  updateAccountById,
  updateAllAccounts,
  deleteAccountById,
}
