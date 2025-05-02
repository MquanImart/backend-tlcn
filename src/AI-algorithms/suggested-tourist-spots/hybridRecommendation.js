import cententBase from "./content_base.js";
import collaborativeFiltering from "./collaborative-filtering.js";
import RecentView from "../../models/RecentView.js";

async function getRecommendedPlacesHybrid(currentUserId, topN = 5) {

    // Lấy các tags từ Collaborative Filtering
    const similarUsers = await collaborativeFiltering.collaborativeFilteringUser(currentUserId, 10);
    const currentUserData = await RecentView.find({ idUser: currentUserId });

    const tagsFrequencyMap = new Map();
    const currentUserTags = new Set();

    currentUserData.forEach(record => {
      record.view.forEach(view => {
        view.tags.forEach(tag => {
          currentUserTags.add(tag);
        });
      });
    });
      
    await Promise.all(
      similarUsers.map(async (similar) => {
        const userRecord = await RecentView.find({ idUser: similar.userId });
    
        userRecord.forEach(record => {
          record.view.forEach(view => {
            view.tags.forEach(tag => {
              if (!currentUserTags.has(tag)) {
                tagsFrequencyMap.set(tag, (tagsFrequencyMap.get(tag) || 0) + similar.similarity);
              }
            });
          });
        });
      })
    );
    
    const result = await cententBase.ContentBased(currentUserId, tagsFrequencyMap);

    return result;
}
  

export default getRecommendedPlacesHybrid;