import ContentBased from "./content_base.js";

const suggestedTouris = async (userId) => {
  //const pretreatment = await pretreatmentService.ConvertUserMatrix();
  //if (pretreatment === null)  return { success: false }

  const result = await ContentBased(userId);

  return { success: true, data: result };
};

const suggestedTourisService = {
  suggestedTouris
}

export default suggestedTourisService;