import suggestedTourisService from "./main.js";

const suggestTouristForUser = async (req, res) => {
  try {
    const result = await suggestedTourisService.suggestedTouris(req.params.id);
    if (!result.success) return res.status(400).json({ success: false, message: 'Không thể gợi ý' });
    
    res.status(200).json({ success: true, data: result.data, message: 'Danh sách gợi ý địa điểm du lịch cho người dùng' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const SuggestTouristController = {
    suggestTouristForUser
}

export default SuggestTouristController;