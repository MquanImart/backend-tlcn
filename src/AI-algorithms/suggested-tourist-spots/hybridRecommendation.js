import cententBase from "./content_base.js";
import collaborativeFiltering from "./collaborative-filtering.js";
import RecentView from "../../models/RecentView.js";
import data_preparation from "./data_preparation.js";
import recommendationsContentBase from "./content_base_v2.js";
import { findSimilarUsers } from "./collaborative_filtering_v2.js";

async function getRecommendedPlacesHybrid(currentUserId, topN = 5) {
    const allUser = await data_preparation.getAllUserProfiles();
    return findSimilarUsers(currentUserId,allUser );
    // Lấy các tags từ Collaborative Filtering
    // const similarUsers = await collaborativeFiltering.collaborativeFilteringUser(currentUserId, 10);
    // const currentUserData = await RecentView.find({ idUser: currentUserId });

    // const tagsFrequencyMap = new Map();
    // const currentUserTags = new Set();

    // currentUserData.forEach(record => {
    //   record.view.forEach(view => {
    //     view.tags.forEach(tag => {
    //       currentUserTags.add(tag);
    //     });
    //   });
    // });
      
    // await Promise.all(
    //   similarUsers.map(async (similar) => {
    //     const userRecord = await RecentView.find({ idUser: similar.userId });
    
    //     userRecord.forEach(record => {
    //       record.view.forEach(view => {
    //         view.tags.forEach(tag => {
    //           if (!currentUserTags.has(tag)) {
    //             tagsFrequencyMap.set(tag, (tagsFrequencyMap.get(tag) || 0) + similar.similarity);
    //           }
    //         });
    //       });
    //     });
    //   })
    // );
    
    // const result = await cententBase.ContentBased(currentUserId, tagsFrequencyMap);

    // return result;
}
  
async function getRecommendedPagesHybrid(currentUserId, topN = 5) {
    const dataUser = await data_preparation.dataPreparationUser(currentUserId);
    const dataPages = await data_preparation.dataPreparationPages();

    const resultContentbase = await recommendationsContentBase(dataUser, dataPages);

    return resultContentbase;
}

export {
    getRecommendedPlacesHybrid,
    getRecommendedPagesHybrid
};