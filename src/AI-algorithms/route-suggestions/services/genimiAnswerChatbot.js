import { GoogleGenAI } from "@google/genai";
import { env } from "../../../config/environment.js";
import mongoose from 'mongoose';
import TouristDestination from "../../../models/TouristDestination.js";
import Page from "../../../models/Page.js";
import Article from "../../../models/Article.js";
import Reels from "../../../models/Reels.js";
import Group from "../../../models/Group.js";

// Khởi tạo Google Gemini AI
const ai = new GoogleGenAI({ apiKey: env.API_KEY_GENIMI });

// Hàm thoát ký tự đặc biệt cho regex
const escapeRegExp = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

// Hàm ghi hoa chữ cái đầu mỗi từ
const capitalizeWords = (str) => {
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

// Hàm trích xuất địa danh từ userQuery
const extractKeywords = (query) => {
  if (!query || typeof query !== 'string' || query.trim().length === 0) {
    return { keywords: [], regexPattern: '' }; // Trả về mặc định nếu query không hợp lệ
  }

  // Danh sách địa danh Việt Nam
  const placeNames = [
    'hà nội', 'tp hồ chí minh', 'đà nẵng', 'hội an', 'đà lạt',
    'huế', 'nha trang', 'phú quốc', 'sapa', 'ha long', 
    'mũi né', 'phong nha', 'mỹ tho', 'cần thơ', 'vũng tàu',
    'quy nhơn', 'phan thiết', 'bạc liêu', 'cà mau', 'rạch giá',
    'bắc kạn', 'bảo lộc', 'bến tre', 'buôn ma thuột', 'cát bà',
    'châu đốc', 'điện biên phủ', 'đồng hới', 'hà giang', 'hà tĩnh',
    'hải phòng', 'kon tum', 'lạng sơn', 'lào cai', 'long xuyên',
    'lý sơn', 'mộc châu', 'nam định', 'nghệ an', 'ninh bình',
    'pleiku', 'sóc trăng', 'sơn la', 'tam kỳ', 'tây ninh',
    'thái bình', 'thái nguyên', 'thanh hóa', 'tuy hòa', 'vinh',
    'yên bái', 'tam cốc', 'tràng an', 'bái đính', 'my son',
    'cù lao chàm', 'bà nà hills', 'lan hà', 'bai tu long', 'mê kông delta'
  ];

  const lowerQuery = query.toLowerCase();
  const keywords = [];

  // Lọc các địa danh có trong câu hỏi
  for (const place of placeNames) {
    if (lowerQuery.includes(place)) {
      keywords.push(capitalizeWords(place));
    }
  }

  // Loại bỏ trùng lặp
  const uniqueKeywords = [...new Set(keywords)];

  // Nếu có địa danh, tạo regex pattern từ các địa danh; nếu không, dùng query gốc
  const regexPattern = uniqueKeywords.length > 0 
    ? uniqueKeywords.map(escapeRegExp).join('|')
    : escapeRegExp(query.trim());

  return { keywords: uniqueKeywords, regexPattern };
};

const getGenimiChatbot = async (userQuery) => {
  try {
    console.log("Received user query:", userQuery);

    // Kiểm tra đầu vào
    if (!userQuery || typeof userQuery !== 'string' || userQuery.trim().length === 0) {
      return "Vui lòng cung cấp câu hỏi hợp lệ.";
    }

    // Trích xuất địa danh và regex pattern
    const { keywords, regexPattern } = extractKeywords(userQuery);
    console.log("Extracted locations:", keywords);
    console.log("Regex pattern:", regexPattern);

    // Tìm kiếm dữ liệu liên quan trong các collection bằng $regex
    const searchResults = await Promise.all([
      // Tìm kiếm trong TouristDestination
      TouristDestination.find({
        $or: [
          { name: { $regex: regexPattern, $options: 'i' } },
          { province: { $regex: regexPattern, $options: 'i' } },
        ]
      })
        .lean(),
      
      // Tìm kiếm trong Page
      Page.find({
        name: { $regex: regexPattern, $options: 'i' }
      })
        .lean(),
      
      // Tìm kiếm trong Article
      Article.find({
        $or: [
          { content: { $regex: regexPattern, $options: 'i' } },
          { hashTag: { $regex: regexPattern, $options: 'i' } }
        ]
      })
        .lean(),
      
      // Tìm kiếm trong Reels
      Reels.find({
        $or: [
          { content: { $regex: regexPattern, $options: 'i' } },
          { hashTag: { $regex: regexPattern, $options: 'i' } }
        ]
      })
        .lean(),
      
      // Tìm kiếm trong Group
      Group.find({
        $or: [
          { groupName: { $regex: regexPattern, $options: 'i' } },
          { introduction: { $regex: regexPattern, $options: 'i' } },
          { type: { $regex: regexPattern, $options: 'i' } }
        ]
      })
        .lean(),
    ]);

    // Gộp và định dạng dữ liệu tìm kiếm
    const context = [];

    // Xử lý dữ liệu từ TouristDestination
    if (searchResults[0].length > 0) {
      context.push(
        `*Thông tin điểm du lịch*:\n${searchResults[0]
          .map(
            (dest) =>
              `*${
                keywords.includes(capitalizeWords(dest.name)) ? capitalizeWords(dest.name) : dest.name
              }* (${dest.province}). Thời gian lý tưởng: tháng ${dest.best_months.join(", ")}. Tọa độ: [${dest.coordinates.join(", ")}].`
          )
          .join("\n")}`
      );
    }

    // Xử lý dữ liệu từ Page
    if (searchResults[1].length > 0) {
      context.push(
        `*Thông tin trang*:\n${searchResults[1]
          .map(
            (page) =>
              `*${
                keywords.includes(capitalizeWords(page.name)) ? capitalizeWords(page.name) : page.name
              }*: Giờ mở cửa: ${page.timeOpen || "Không rõ"} - ${page.timeClose || "Không rõ"}. Số người theo dõi: ${page.follower.length}.`
          )
          .join("\n")}`
      );
    }

    // Xử lý dữ liệu từ Article
    if (searchResults[2].length > 0) {
      context.push(
        `*Bài viết liên quan*:\n${searchResults[2]
          .map(
            (article) =>
              `*Bài viết*: ${article.content.substring(0, 100)}... Hashtag: ${article.hashTag.join("")}.`
          )
          .join("\n")}`
      );
    }

    // Xử lý dữ liệu từ Reels
    if (searchResults[3].length > 0) {
      context.push(
        `*Reels liên quan*:\n${searchResults[3]
          .map(
            (reel) =>
              `*Reels*: ${reel.content.substring(0, 100)}... Hashtag: ${reel.hashTag.join(", ")}.`
          )
          .join("\n")}`
      );
    }

    // Xử lý dữ liệu từ Group
    if (searchResults[4].length > 0) {
      context.push(
        `*Nhóm liên quan*:\n${searchResults[4]
          .map(
            (group) =>
              `*${
                keywords.includes(capitalizeWords(group.groupName)) ? capitalizeWords(group.groupName) : group.groupName
              }* (${group.type}): ${group.introduction || "Không có mô tả"}. Số thành viên: ${group.members.length}.`
          )
          .join("\n")}`
      );
    }

    console.log("Context for Gemini:", context);

    // Tạo prompt cho Gemini
    const systemPrompt = `Bạn là trợ lý hỗ trợ khách hàng cho mạng xã hội du lịch VieWay. Nhiệm vụ là trả lời câu hỏi của người dùng bằng tiếng Việt, dựa trên thông tin từ cơ sở dữ liệu dưới đây và chỉ cho ra các hashtag có từ bài viết có liên quan. Các địa danh phải được đánh dấu bằng dấu sao đơn (*text*), không sử dụng dấu sao kép (**),không sử dụng dấu ngoặc tròn, thẻ HTML, hoặc định dạng Markdown khác. Nếu không có dữ liệu liên quan, hãy trả lời bằng kiến thức chung và giữ giọng điệu thân thiện, truyền cảm hứng.

--- NỘI DUNG TÀI LIỆU ---
${context.length > 0 ? context.join("\n\n") : "Không có dữ liệu liên quan từ cơ sở dữ liệu."}
--- HẾT ---

Câu hỏi của người dùng: ${userQuery}`;

    // Gọi Gemini API
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: systemPrompt,
    });

    const answer = response?.candidates?.[0]?.content?.parts?.[0]?.text || "Không thể tạo câu trả lời.";
    return answer;
  } catch (error) {
    console.error("Lỗi xử lý câu hỏi chatbot:", error.message, error.stack);
    return "Không thể xử lý câu hỏi. Vui lòng thử lại sau.";
  }
};

export const genimiAnswerChatbot = {
  getGenimiChatbot,
};