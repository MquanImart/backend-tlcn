import { accountService } from '../services/accountService.js'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken';
import crypto from 'crypto'; // Dùng để tạo mã OTP ngẫu nhiên
import twilio from 'twilio'; // Thêm Twilio vào để gửi SMS
import nodemailer from 'nodemailer';
import Account from "../models/Account.js";
import User from "../models/User.js";
dotenv.config()
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
      const { email, password, displayName, hashtag } = req.body;

      console.log("📩 Dữ liệu nhận từ client:", { email, password, displayName, hashtag });

      // Kiểm tra dữ liệu đầu vào
      if (!email || !password || !displayName || !hashtag) {
          return res.status(400).json({ success: false, message: "Vui lòng nhập đầy đủ email, password, displayName, hashtag." });
      }

      // Kiểm tra xem email đã tồn tại chưa
      const existingAccount = await Account.findOne({ email });
      if (existingAccount) {
          return res.status(400).json({ success: false, message: "Email đã tồn tại!" });
      }

      // Tạo Account mới
      const newAccount = new Account({
          email,
          phone: null, // Không có phone
          password, // Nếu muốn hash thì dùng bcrypt
          role: "user",
      });

      await newAccount.save();

      // Tạo User mới liên kết với Account
      const newUser = new User({
          account: newAccount._id,
          identification: null, // Không có thông tin ID
          displayName,
          hashtag,
          address: null, // Không có địa chỉ ban đầu
          avt: [],
          aboutMe: "",
          hobbies: [],
          friends: [],
          articles: [],
          reels: [],
          pages: {
              _id: newAccount._id,
              createPages: [],
              followerPages: [],
          },
          saveAddress: [],
          trips: [],
          collections: [],
          groups: {
              _id: newAccount._id,
              createGroups: [],
              saveGroups: [],
          },
          follow: [],
      });

      await newUser.save();

      return res.status(201).json({ success: true, message: "Tạo tài khoản thành công!", account: newAccount, user: newUser });
  } catch (error) {
      console.error("❌ Lỗi tạo tài khoản:", error);
      return res.status(500).json({ success: false, message: "Lỗi hệ thống, vui lòng thử lại." });
  }
};

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
const loginAccount = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập email và mật khẩu' })
    }

    const account = await accountService.getAccountByEmail(email)
    if (!account) {
      return res.status(401).json({ success: false, message: 'Email hoặc mật khẩu không đúng' })
    }

    const isPasswordValid = await accountService.comparePassword(password, account.password)
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Email hoặc mật khẩu không đúng' })
    }

    // Tạo token JWT
    const token = jwt.sign(
      { id: account.id, email: account.email, role: account.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' } // Token hết hạn sau 7 ngày
    )

    res.status(200).json({
      success: true,
      data: { token, account },
      message: 'Đăng nhập thành công',
    })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}
const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
// Hàm gửi OTP
const sendOtp = async (req, res) => {
  try {
    const { input } = req.body;
    
    if (!input) {
      return res.status(400).json({ success: false, message: "Vui lòng nhập email của bạn." });
    }

    // Kiểm tra email hợp lệ
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
    if (!isEmail) {
      return res.status(400).json({ success: false, message: "Email không hợp lệ." });
    }

    // Kiểm tra email có tồn tại trong hệ thống không
    const account = await accountService.getAccountByEmail(input);
    if (!account) {
      return res.status(404).json({ success: false, message: "Email không tồn tại trong hệ thống." });
    }

    // Tạo mã OTP ngẫu nhiên
    const otp = Math.floor(100000 + Math.random() * 900000); // 6 chữ số

    // Cấu hình transporter để gửi email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // Email gửi đi
        pass: process.env.EMAIL_PASS, // Mật khẩu email
      },
    });

    // Nội dung email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: input,
      subject: "Mã OTP Xác Minh",
      text: `Mã OTP của bạn là: ${otp}. Vui lòng không chia sẻ mã này với bất kỳ ai.`,
    };

    // Gửi OTP qua email
    await transporter.sendMail(mailOptions);

    // Lưu OTP vào cơ sở dữ liệu hoặc Redis
    await accountService.storeOtp(input, otp);

    return res.status(200).json({
      success: true,
      message: "Mã OTP đã được gửi đến email của bạn.",
    });

  } catch (error) {
    console.error("Lỗi gửi OTP:", error);
    return res.status(500).json({ success: false, message: "Lỗi máy chủ. Vui lòng thử lại." });
  }
};
const verifyOtp = async (req, res) => {
  try {
      const { input, otp } = req.body;
      // Lấy OTP đã lưu từ DB hoặc Redis
      const storedOtp = await accountService.getOtp(input);

      if (!storedOtp) {
          return res.status(400).json({ success: false, message: "OTP đã hết hạn hoặc không tồn tại." });
      }

      // Kiểm tra OTP có khớp không
      if (storedOtp !== otp) {
          return res.status(400).json({ success: false, message: "Mã OTP không chính xác." });
      }

      // Xóa OTP sau khi xác minh thành công (tránh dùng lại)
      await accountService.deleteOtp(input);

      return res.status(200).json({ success: true, message: "Xác minh OTP thành công!" });

  } catch (error) {
      console.error("❌ Lỗi xác minh OTP:", error);
      return res.status(500).json({ success: false, message: "Lỗi máy chủ, vui lòng thử lại." });
  }
};
const updatePassword = async (req, res) => {
  try {
      const { email, newPassword } = req.body;

      console.log("🔍 Nhận yêu cầu đổi mật khẩu:", { email, newPassword });

      if (!email || !newPassword) {
          return res.status(400).json({ success: false, message: "Vui lòng cung cấp email và mật khẩu mới." });
      }

      // Kiểm tra email có tồn tại không
      const account = await accountService.getAccountByEmail(email);
      if (!account) {
          return res.status(404).json({ success: false, message: "Email không tồn tại trong hệ thống." });
      }

      // Cập nhật mật khẩu mà KHÔNG mã hóa
      await accountService.updatePassword(email, newPassword);

      return res.status(200).json({ success: true, message: "Mật khẩu đã được cập nhật thành công." });
  } catch (error) {
      console.error("❌ Lỗi cập nhật mật khẩu:", error);
      return res.status(500).json({ success: false, message: "Lỗi hệ thống, vui lòng thử lại." });
  }
};
export const accountController = {
  getAccounts,
  getAccountById,
  createAccount,
  updateAccountById,
  updateAllAccounts,
  deleteAccountById,
  loginAccount,
  sendOtp,
  verifyOtp,
  updatePassword,
}
