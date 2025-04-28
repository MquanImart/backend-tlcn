import RecentView from "../../models/RecentView.js";
import TouristDestination from "../../models/TouristDestination.js";

async function getUserProfileWithFrequencies(userId) {
    try {
      const recentViews = await RecentView.findOne({ idUser: userId });
      if (!recentViews) {
        return {};
      }
      const profile = {};
      recentViews.view.forEach(item => {
        item.tags.forEach(tag => {
          profile[tag] = (profile[tag] || 0) + 1;
        });
      });
      return profile;
    } catch (error) {
      console.error("Lỗi khi lấy hồ sơ người dùng:", error);
      return {};
    }
}
  
function cosineSimilarity(profileVector, placeTags) {
    let dotProduct = 0;
    let profileMagnitude = 0;
    let placeMagnitude = 0;
    const allUniqueTags = Object.keys(profileVector).concat(placeTags.filter(tag => !(tag in profileVector)));
  
    for (const tag of allUniqueTags) {
      const profileValue = profileVector[tag] || 0;
      const placeValue = placeTags.includes(tag) ? 1 : 0; // Coi mỗi tag của địa điểm có giá trị 1
  
      dotProduct += profileValue * placeValue;
      profileMagnitude += profileValue * profileValue;
      placeMagnitude += placeValue * placeValue;
    }
  
    const profileNorm = Math.sqrt(profileMagnitude);
    const placeNorm = Math.sqrt(placeMagnitude);
  
    if (profileNorm === 0 || placeNorm === 0) {
      return 0;
    }
    
    return dotProduct / (profileNorm * placeNorm);
}

async function ContentBased (userId) {
    const userProfile = await getUserProfileWithFrequencies(userId);
    
    if (Object.keys(userProfile).length === 0) {
        return null;
    }
    
    const allPlaces = await TouristDestination.find();
    
    if (allPlaces.length === 0) {
      return null;
    }

    const recommendations = allPlaces.map(place => ({
        ...place._doc,
        similarityScore: cosineSimilarity(userProfile, place.tags),
    }))
    .sort((a, b) => b.similarityScore - a.similarityScore);
    const topRecommendations = recommendations.slice(0, 10);

    return topRecommendations;
}

export default ContentBased;