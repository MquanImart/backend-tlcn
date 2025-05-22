import mongoose from 'mongoose';
import Account from "../models/Account.js";
import OtpModel from "../models/OtpModel.js";
import User from "../models/User.js";
import Identification from "../models/Identification.js";
import Address from "../models/Address.js";
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import twilio from 'twilio';
import nodemailer from 'nodemailer';

const getAccounts = async (options = {}) => {
  const { filter, page = 1, limit = 10 } = options; // Default page 1, limit 10

  const query = {};

  // Apply filters
  if (filter) {
    switch (filter) {
      case 'deleted': 
        query._destroy = { $ne: null };
        break;
      case 'online': 
        query.state = 'online';
        query._destroy = null; 
        break;
      case 'offline': 
        query.state = 'offline';
        query._destroy = null; 
        break;
      case 'all_active':
        query._destroy = null;
        break;
    }
  } else {
    query._destroy = null;
  }


  const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

  try {
    const accounts = await Account.find(query)
      .skip(skip)
      .limit(parseInt(limit, 10))
      .sort({ createdAt: -1 }); 

    const totalAccounts = await Account.countDocuments(query);

    return {
      accounts,
      totalPages: Math.ceil(totalAccounts / parseInt(limit, 10)),
      currentPage: parseInt(page, 10),
      totalAccounts,
    };
  } catch (error) {
    throw error;
  }
};

const getAccountById = async (id) => {
  return await Account.findById(id);
};

const updateAccountById = async (id, data) => {
  return await Account.findByIdAndUpdate(id, data, { new: true });
};

const updateAllAccounts = async (data) => {
  return await Account.updateMany({}, data, { new: true });
};

const getAccountByEmail = async (email) => {
  return await Account.findOne({ email });
};

const deleteAccountById = async (id) => {
  return await Account.findByIdAndDelete(id);
};

const comparePassword = async (password, storedPassword) => {
  return password === storedPassword;
};

const storeOtp = async (input, otp) => {
  await OtpModel.findOneAndUpdate(
    { input },
    { otp, createdAt: new Date() },
    { upsert: true, new: true }
  );
};

const getOtp = async (input) => {
  const otpRecord = await OtpModel.findOne({ input });
  return otpRecord ? otpRecord.otp : null;
};

const deleteOtp = async (input) => {
  await OtpModel.deleteOne({ input });
};

const loginAccount = async (email, password) => {
  const account = await getAccountByEmail(email);
  if (!account) {
    return {
      success: false,
      message: 'Email hoặc mật khẩu không đúng',
    };
  }

  const isPasswordValid = await comparePassword(password, account.password);
  if (!isPasswordValid) {
    return {
      success: false,
      message: 'Email hoặc mật khẩu không đúng',
    };
  }

  const user = await User.findOne({ account: account._id });
  const token = jwt.sign(
    {
      userId: user._id,
      accountId: account._id,
      email: account.email,
      role: account.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' } // Token hết hạn sau 1 giờ
  );
  return {
    success: true,
    data: {
      user: {
        _id: user._id,
        displayName: user.displayName,
        hashtag: user.hashtag,
        avt: user.avt,
        hobbies: user.hobbies,
        setting: user.setting,
      },
      account: account,
      token: token, 
    },
  };
};

const sendOtp = async (input) => {
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
  if (!isEmail) {
    return {
      success: false,
      status: 400,
      message: "Email không hợp lệ.",
    };
  }

  const account = await getAccountByEmail(input);
  if (!account) {
    return {
      success: false,
      status: 404,
      message: "Email không tồn tại trong hệ thống.",
    };
  }

  try {
    const otp = Math.floor(100000 + Math.random() * 900000);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: input,
      subject: "Mã OTP Xác Minh",
      text: `Mã OTP của bạn là: ${otp}. Vui lòng không chia sẻ mã này với bất kỳ ai.`,
    };

    await transporter.sendMail(mailOptions);
    await storeOtp(input, otp);

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      status: 500,
      message: "Lỗi khi gửi OTP",
    };
  }
};

const updatePassword = async (email, newPassword) => {
  return await Account.findOneAndUpdate(
    { email },
    { password: newPassword },
    { new: true }
  );
};

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
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Kiểm tra dữ liệu đầu vào
    if (!email || !password || !displayName || !hashtag) {
      throw new Error("Vui lòng nhập đầy đủ email, password, displayName, hashtag.");
    }

    const requiredFields = ["number", "fullName", "dateOfBirth", "sex", "dateOfExpiry"];
    const cccdData = { number, fullName, dateOfBirth, sex, dateOfExpiry };
    const missingFields = requiredFields.filter(
      (field) => !cccdData[field] || cccdData[field].toString().trim() === ""
    );
    if (missingFields.length > 0) {
      throw new Error(`Thiếu các trường bắt buộc trong dữ liệu CCCD: ${missingFields.join(", ")}`);
    }

    // Kiểm tra CCCD đã tồn tại
    const existingIdentification = await Identification.findOne({ number }).session(session);
    if (existingIdentification) {
      throw new Error("Căn cước công dân đã được sử dụng!");
    }

    // Tạo Identification
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
    await newIdentification.save({ session });

    // Tạo Account với mật khẩu dạng văn bản thuần
    const newAccount = new Account({
      email,
      phone: null,
      password: password,
      role: "user",
    });
    await newAccount.save({ session });

    // Tạo Address
    const newAddress = new Address({
      province: province || "",
      district: district || "",
      ward: ward || "",
      street: street || "",
      placeName: placeName || "",
      lat: lat || null,
      long: long || null,
    });
    await newAddress.save({ session });

    // Tạo User
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
    await newUser.save({ session });

    await session.commitTransaction();
    return { success: true, newAccount, newUser };
  } catch (error) {
    await session.abortTransaction();
    throw new Error(error.message || "Lỗi hệ thống, vui lòng thử lại.");
  } finally {
    session.endSession();
  }
};

const checkEmail = async (email) => {
  const existingAccount = await Account.findOne({ email });
  return {
    exists: !!existingAccount,
    message: existingAccount ? "Email đã tồn tại trong hệ thống" : "Email khả dụng",
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
};