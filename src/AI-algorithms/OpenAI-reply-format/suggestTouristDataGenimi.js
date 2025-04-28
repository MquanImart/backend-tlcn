import { GoogleGenAI } from "@google/genai";
import { env } from "../../config/environment.js";

const ai = new GoogleGenAI({ apiKey: env.API_KEY_GENIMI });

async function suggestTouristData(pageName) {
  const prompt = `Gợi ý giúp tôi:
- Tên tỉnh của điểm du lịch ${pageName} (trả về tên ngắn gọn, ví dụ Đồng Tháp)
- Những tháng đẹp nhất để du lịch ${pageName} (trả về danh sách số tháng, ví dụ [1,2,3])
- Những tags phù hợp cho ${pageName} (trả về danh sách các tag tiếng Anh từ danh sách sau: ['mountain', 'beach', 'forest', 'grassland', 'desert', 'river', 'lake', 'waterfall', 'cave', 'rice_field', 'flower_field', 'sky', 'island', 'volcano', 'national_park', 'canyon', 'snow', 'wildlife', 'bird', 'livestock', 'marine_life', 'festival', 'traditional_costume', 'market', 'cuisine', 'village', 'local_people', 'ceremony', 'street_art', 'historical_site', 'landmark', 'bridge', 'cityscape', 'traditional_house', 'old_town', 'castle', 'trekking', 'diving', 'camping', 'kayaking', 'hot_air_balloon', 'cycling', 'motorcycling', 'skiing', 'surfing', 'paragliding', 'street', 'transport', 'tree', 'weather', 'light', 'signpost', 'season', 'sunset', 'sunrise', 'aurora', 'night_sky', 'rock', 'lantern', 'photography', 'clouds'])`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    const text = response?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (text) {
        const lines = text.split('\n').map(line => line.trim());
        console.log(lines);
        // Lấy tên tỉnh
        const province = lines.find(line => line.includes('Tên tỉnh')).split(':')[1].trim().replace(/^\*\*\s*/g, '');

        // Lấy tháng đẹp nhất
        const bestMonths = lines.find(line => line.includes('Những tháng đẹp nhất')).split(':')[1].trim().match(/\[([^\]]+)\]/)[1];

        // Lấy tags
        const tags = lines.find(line => line.includes('Tags phù hợp'))
          .split(':')[1]
          .replace(/[\[\]']+/g, '')  // Loại bỏ dấu [] và '
          .split(',')
          .map(tag => tag.trim().replace(/^(\*\*\s*)/, ''));  // Loại bỏ ** và khoảng trắng ở đầu mỗi tag
          
      return { province, bestMonths, tags };
    } else {
      console.error("Không nhận được phản hồi hợp lệ từ mô hình.");
      return null;
    }
  } catch (error) {
    console.error("Đã xảy ra lỗi khi gọi mô hình:", error);
    return null;
  }
}

export default suggestTouristData;