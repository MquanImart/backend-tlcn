import mongoose, { Schema } from 'mongoose';

const RecentViewSchema = new Schema({
  idUser: { type: String, required: true },
  view: [
    {
        tags: [{
            type: String,
            enum: [
              'mountain',           // Núi
              'beach',             // Biển
              'forest',            // Rừng
              'grassland',         // Thảo nguyên
              'desert',            // Sa mạc
              'river',             // Sông
              'lake',              // Hồ
              'waterfall',         // Thác nước
              'cave',              // Hang động
              'rice_field',        // Đồng lúa, ruộng bậc thang
              'flower_field',      // Vườn hoa
              'sky',               // Bầu trời
              'island',            // Đảo
              'volcano',           // Núi lửa
              'national_park',     // Vườn quốc gia
              'canyon',            // Hẻm núi
              'snow',              // Băng tuyết
              'wildlife',          // Động vật hoang dã
              'bird',              // Chim
              'livestock',         // Gia súc
              'marine_life',       // Động vật biển
              'festival',          // Lễ hội
              'traditional_costume', // Trang phục truyền thống
              'market',            // Chợ
              'cuisine',           // Ẩm thực
              'village',           // Làng quê
              'local_people',      // Người dân địa phương
              'ceremony',          // Nghi thức truyền thống
              'street_art',        // Nghệ thuật đường phố
              'historical_site',   // Di tích lịch sử
              'landmark',          // Công trình biểu tượng
              'bridge',            // Cầu
              'cityscape',         // Thành phố
              'traditional_house', // Nhà truyền thống
              'old_town',          // Phố cổ
              'castle',            // Lâu đài
              'trekking',          // Trekking
              'diving',            // Lặn biển
              'camping',           // Cắm trại
              'kayaking',          // Chèo thuyền
              'hot_air_balloon',   // Khinh khí cầu
              'cycling',           // Xe đạp
              'motorcycling',      // Mô tô
              'skiing',            // Trượt tuyết
              'surfing',           // Lướt sóng
              'paragliding',       // Nhảy dù
              'street',            // Đường phố
              'transport',         // Phương tiện giao thông
              'tree',              // Cây cối
              'weather',           // Thời tiết
              'light',             // Ánh sáng
              'signpost',          // Bảng chỉ đường
              'season',            // Mùa
              'sunset',            // Hoàng hôn
              'sunrise',           // Bình minh
              'aurora',            // Cực quang
              'night_sky',          // Bầu trời đêm
              'rock',                // Đá, bãi đá,...
              'lantern',             // Đèn lồng
              'photography',
              'clouds',
            ],
            required: true
        }],
        date: {
            type: Date,
            required: true
        },
        action: { type: "View" | "Like", default: "View"},
    }
  ]
});

const RecentView = mongoose.model('RecentView', RecentViewSchema);
export default RecentView;