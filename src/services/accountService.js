import Account from "../models/Account.js"
import OtpModel from "../models/OtpModel.js";
import bcrypt from 'bcrypt';
import User from "../models/User.js";
import Identification from "../models/Identification.js";
import Address from "../models/Address.js";
import jwt from 'jsonwebtoken';
import crypto from 'crypto'; // Dùng để tạo mã OTP ngẫu nhiên
import twilio from 'twilio'; // Thêm Twilio vào để gửi SMS
import nodemailer from 'nodemailer';

const getAccounts = async () => {
  return await Account.find()
}

const getAccountById = async (id) => {
  return await Account.findById(id)
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
const loginAccount = async (email, password) => {
  const account = await getAccountByEmail(email)
  if (!account) {
    return {
      success: false,
      message: 'Email hoặc mật khẩu không đúng'
    }
  }

  const isPasswordValid = await comparePassword(password, account.password)
  if (!isPasswordValid) {
    return {
      success: false, 
      message: 'Email hoặc mật khẩu không đúng'
    }
  }

  const user = await User.findOne({account: account._id});

  return {
    success: true,
    data: {
      user: {
        _id: user._id,
        displayName: user.displayName,
        hashtag: user.hashtag,
        avt: user.avt,
        hobbies: user.hobbies,
        setting: user.setting
      },
      account: account
    } 
  }
}

const sendOtp = async (input) => {
  // Kiểm tra email hợp lệ
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
  if (!isEmail) {
    return {
      success: false,
      status: 400,
      message: "Email không hợp lệ."
    };
  }

  // Kiểm tra email có tồn tại
  const account = await getAccountByEmail(input);
  if (!account) {
    return {
      success: false,
      status: 404,
      message: "Email không tồn tại trong hệ thống."
    };
  }

  try {
    // Tạo mã OTP ngẫu nhiên
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Cấu hình transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Cấu hình email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: input,
      subject: "Mã OTP Xác Minh",
      text: `Mã OTP của bạn là: ${otp}. Vui lòng không chia sẻ mã này với bất kỳ ai.`,
    };

    // Gửi email
    await transporter.sendMail(mailOptions);

    // Lưu OTP
    await storeOtp(input, otp);

    return {
      success: true
    };

  } catch (error) {
    return {
      success: false,
      status: 500,
      message: "Lỗi khi gửi OTP"
    };
  }
};
const updatePassword = async (email, newPassword) => {
  return await Account.findOneAndUpdate(
      { email },
      { password: newPassword }, // Lưu trực tiếp mật khẩu mới
      { new: true }
  );
}
const createAccount = async ({
  email,
  password,
  displayName,
  hashtag,
  number,
  fullName,
  dateOfBirth,
  sex,
  nationality,
  placeOfOrigin,
  placeOfResidence,
  dateOfExpiry,
  province,
  district,
  ward,
  street,
  placeName,
  lat,
  long,
}) => {
  try {
    // Kiểm tra dữ liệu đầu vào
    if (!email || !password || !displayName || !hashtag) {
      throw new Error("Vui lòng nhập đầy đủ email, password, displayName, hashtag.");
    }

      const requiredFields = ["number", "fullName", "dateOfBirth", "sex", "dateOfExpiry"];
      const cccdData = { number, fullName, dateOfBirth, sex, dateOfExpiry };
      const missingFields = requiredFields.filter((field) => !cccdData[field] || cccdData[field].trim() === "");
      if (missingFields.length > 0) {
        throw new Error(`Thiếu các trường bắt buộc trong dữ liệu CCCD: ${missingFields.join(", ")}`);
      }

      const existingIdentification = await Identification.findOne({ number });
      if (existingIdentification) {
        throw new Error("Căn cước công dân đã được sử dụng!");
      }

      const newIdentification = new Identification({
        number,
        fullName,
        dateOfBirth,
        sex,
        nationality: nationality || "Việt Nam",
        placeOfOrigin,
        placeOfResidence,
        dateOfExpiry,
      });

      await newIdentification.save();


    // Tạo Account mới
    const newAccount = new Account({
      email,
      phone: null,
      password,
      role: "user",
    });

    await newAccount.save();

    // Tạo Address từ các trường riêng lẻ (nếu có)
    let addressId = null;
      const newAddress = new Address({
        province: province || "",
        district: district || "",
        ward: ward || "",
        street: street || "",
        placeName: placeName || "Nơi ở",
        lat: lat || null,
        long: long || null,
      });

      await newAddress.save();

    
    // Tạo User mới với addressId
    const newUser = new User({
      account: newAccount._id,
      identification: newIdentification._id,
      displayName,
      hashtag,
      address: newAddress._id,
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

    return { newAccount, newUser };
  } catch (error) {
    throw new Error(error.message || "Lỗi hệ thống, vui lòng thử lại.");
  }
};
const checkEmail = async (email) => {
  const existingAccount = await Account.findOne({ email });
  return {
    exists: !!existingAccount,
    message: existingAccount ? "Email đã tồn tại trong hệ thống" : "Email khả dụng"
  };
};
const checkHashtag = async (hashtag) => {
  const existingUser = await User.findOne({ hashtag });
  return {
    exists: !!existingUser,
    message: existingUser ? "Hashtag đã tồn tại trong hệ thống" : "Hashtag khả dụng",
  };
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
  loginAccount,
  sendOtp,
  checkEmail,
  checkHashtag,

}
