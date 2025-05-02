import getRecommendedPlacesHybrid from "./hybridRecommendation.js";

const suggestedTouris = async (userId) => {
  //const pretreatment = await pretreatmentService.ConvertUserMatrix();
  //if (pretreatment === null)  return { success: false }

  // const result = await ContentBased(userId);

  // return { success: true, data: result };

  // const result = await collaborativeFiltering.getRecommendedPlacesFromSimilarUsers(userId, 5);
  // return { success: true, data: result };

  const result = await getRecommendedPlacesHybrid(userId);
  return { success: true, data: result };
};

const suggestedTourisService = {
  suggestedTouris
}

export default suggestedTourisService;