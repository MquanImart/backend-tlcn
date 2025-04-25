// controllers/recommendation.js
import RecentView from '../../models/RecentView.js';
import places from './places.json' assert { type: 'json' };

const getRecommendations = async (userId) => {
  try {
    const historyDocs = await RecentView.find({ idUser: userId });

    if (!historyDocs || historyDocs.length === 0) {
        const shuffled = places.sort(() => 0.5 - Math.random());
        const randomSuggestions = shuffled.slice(0, 10); // lấy 10 địa điểm ngẫu nhiên
        return res.json(randomSuggestions);
    }

     // === GỘP TOÀN BỘ CÁC VIEW ===
     const allViews = historyDocs.flatMap(doc => doc.view);

     // === BƯỚC 1: TÍNH TẦN SUẤT TAG ===
     const tagScores = {};
     allViews.forEach(item => {
       const weight = item.action === 'Like' ? 3 : 1;
       item.tags.forEach(tag => {
         tagScores[tag] = (tagScores[tag] || 0) + weight;
       });
     });
 
     // === BƯỚC 2: CHẤM ĐIỂM ĐỊA ĐIỂM ===
     const currentMonth = new Date().getMonth() + 1;
 
     const scoredPlaces = places.map(place => {
       let score = 0;
       place.tags.forEach(tag => {
         score += tagScores[tag] || 0;
       });
 
       if (place.best_months.includes(currentMonth)) {
         score += 2;
       }
 
       return { ...place, score };
     });
 
     const recommendations = scoredPlaces
       .sort((a, b) => b.score - a.score)
       .slice(0, 10);
 
   } catch (err) {
     console.error(err);
     res.status(500).json({ message: 'Server error' });
   }
};

module.exports = { getRecommendations };
