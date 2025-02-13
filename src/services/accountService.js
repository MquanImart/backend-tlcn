import Account from "../models/Account.js"

const getAccounts = async () => {
  return await Account.find()
}

const getAccountById = async (id) => {
  return await Account.findById(id)
}

const createAccount = async (data) => {
  return await Account.create(data)
}

const updateAccountById = async (id, data) => {
  return await Account.findByIdAndUpdate(id, data, { new: true })
}

const updateAllAccounts = async (data) => {
  return await Account.updateMany({}, data, { new: true })
}

const deleteAccountById = async (id) => {
  return await Account.findByIdAndDelete(id)
}

export const accountService = {
  getAccounts,
  getAccountById,
  createAccount,
  updateAccountById,
  updateAllAccounts,
  deleteAccountById,
}
