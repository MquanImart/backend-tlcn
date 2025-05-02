import RecentView from "../../models/RecentView.js";

const convertUserMatrix = async () => { //User-based Collaborative Filtering
    const recentViews = await RecentView.find();
    const allPossibleTags = [
        'mountain', 'beach', 'forest', 'grassland', 'desert', 'river', 'lake', 'waterfall', 'cave', 'rice_field',
        'flower_field', 'sky', 'island', 'volcano', 'national_park', 'canyon', 'snow', 'wildlife', 'bird',
        'livestock', 'marine_life', 'festival', 'traditional_costume', 'market', 'cuisine', 'village',
        'local_people', 'ceremony', 'street_art', 'historical_site', 'landmark', 'bridge', 'cityscape',
        'traditional_house', 'old_town', 'castle', 'trekking', 'diving', 'camping', 'kayaking',
        'hot_air_balloon', 'cycling', 'motorcycling', 'skiing', 'surfing', 'paragliding', 'street',
        'transport', 'tree', 'weather', 'light', 'signpost', 'season', 'sunset', 'sunrise', 'aurora',
        'night_sky', 'rock', 'lantern', 'photography', 'clouds'
    ];

    const userTagMatrix = {};

    recentViews.forEach(record => {
      const userId = record.idUser;
      if (!userTagMatrix[userId]) {
        userTagMatrix[userId] = {};
      }
      record.view.forEach(interaction => {
        interaction.tags.forEach(tag => {
          userTagMatrix[userId][tag] = (userTagMatrix[userId][tag] || 0) + 1;
        });
      });
    });
    
    // Tạo vector đặc trưng cho người dùng
    const userFeatureVectors = {};
    
    for (const userId in userTagMatrix) {
      userFeatureVectors[userId] = {};
      allPossibleTags.forEach(tag => {
        userFeatureVectors[userId][tag] = userTagMatrix[userId][tag] || 0;
      });
    }

    return userFeatureVectors;
}

function cosineSimilarity(vecA, vecB) {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (const tag in vecA) {
    const a = vecA[tag] || 0;
    const b = vecB[tag] || 0;

    dotProduct += a * b;
    normA += a * a;
    normB += b * b;
  }

  if (normA === 0 || normB === 0) return 0;

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

function findSimilarUsers(currentUserId, userFeatureVectors, topN = 5) {
  const similarities = [];

  const currentVector = userFeatureVectors[currentUserId];
  if (!currentVector) return [];

  for (const userId in userFeatureVectors) {
    if (userId === currentUserId) continue;

    const similarity = cosineSimilarity(currentVector, userFeatureVectors[userId]);
    similarities.push({ userId, similarity });
  }

  similarities.sort((a, b) => b.similarity - a.similarity);
  return similarities.slice(0, topN); // lấy top N user giống nhất
}

async function collaborativeFilteringUser (currentUserId, topN) {
  const userFeatureVectors = await convertUserMatrix();
  const similarUsers = findSimilarUsers(currentUserId, userFeatureVectors, topN);
  return similarUsers;
}

export default {
  findSimilarUsers,
  convertUserMatrix,
  cosineSimilarity,
  collaborativeFilteringUser,
};