import data_preparation from "./data_preparation.js";
import recommendationsCB from "./content_base_v2.js";
import { getRecommendedPagesWithDetails } from "./collaborative_filtering_v2.js";

async function getRecommendedPageCF(currentUserId, topN = 5) {
    const allUser = await data_preparation.getAllUserProfiles();
    return getRecommendedPagesWithDetails(currentUserId, allUser);
}
  
async function getRecommendedPagesCB(currentUserId, topN = 5) {
    const dataUser = await data_preparation.dataPreparationUser(currentUserId);
    const dataPages = await data_preparation.dataPreparationPages();
    const resultContentbase = await recommendationsCB(dataUser, dataPages);
    return resultContentbase;
}

async function getRecommendedWithMonth(currentUserId, month) {
    // const dataUser = await data_preparation.dataPreparationUser(currentUserId);
    // const dataPages = await data_preparation.dataPreparationPages();
    // const resultContentbase = await recommendationsContentBase(dataUser, dataPages);
    // return resultContentbase;
    return null;
}

export {
    getRecommendedPageCF,
    getRecommendedPagesCB,
    getRecommendedWithMonth
};