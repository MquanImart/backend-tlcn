import Account from "../models/Account.js"
import OtpModel from "../models/OtpModel.js";
import bcrypt from 'bcrypt';
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
const getAccountByEmail = async (email) => {
  return await Account.findOne({ email }); // Tìm tài khoản theo email
};
const deleteAccountById = async (id) => {
  return await Account.findByIdAndDelete(id)
}
const comparePassword = (password, storedPassword) => {
  return password === storedPassword; // So sánh trực tiếp mật khẩu nhập vào với mật khẩu lưu trong database
};
const storeOtp = async (input, otp) => {
  await OtpModel.findOneAndUpdate(
      { input }, // Tìm theo email/số điện thoại
      { otp, createdAt: new Date() }, // Cập nhật OTP mới
      { upsert: true, new: true }
  );
};

// Lấy OTP từ database
const getOtp = async (input) => {
  const otpRecord = await OtpModel.findOne({ input });
  return otpRecord ? otpRecord.otp : null;
};

// Xóa OTP sau khi xác minh
const deleteOtp = async (input) => {
  await OtpModel.deleteOne({ input });
};
const updatePassword = async (email, newPassword) => {
  return await Account.findOneAndUpdate(
      { email },
      { password: newPassword }, // Lưu trực tiếp mật khẩu mới
      { new: true }
  );
};
export const accountService = {
  getAccounts,
  getAccountById,
  createAccount,
  updateAccountById,
  updateAllAccounts,
  deleteAccountById,
  comparePassword,
  getAccountByEmail,
  storeOtp,
  getOtp, 
  deleteOtp,
  updatePassword,
}
