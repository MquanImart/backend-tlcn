import { buildVocabularyFromProfiles, calculateCosineSimilarity, extractTagsAndWeights } from "./utils/recommendationUtils.js";

function findSimilarUsers(targetUserId, allUserProfiles, topN = 5) {
    const targetUser = allUserProfiles[targetUserId];
    if (!targetUser) {
        console.warn(`Người dùng với ID ${targetUserId} không tìm thấy.`);
        return [];
    }

    const similarities = [];
    const allTextProfilesForVocab = [extractTagsAndWeights(targetUser.textTags)];
    const allImageProfilesForVocab = [extractTagsAndWeights(targetUser.imagesTags)];

    // Thu thập tất cả các profile để xây dựng từ vựng chung
    for (const userId in allUserProfiles) {
        if (userId !== targetUserId) {
            const userProfile = allUserProfiles[userId];
            allTextProfilesForVocab.push(extractTagsAndWeights(userProfile.textTags));
            allImageProfilesForVocab.push(extractTagsAndWeights(userProfile.imagesTags));
        }
    }

    const textVocabulary = buildVocabularyFromProfiles(allTextProfilesForVocab);
    const imageVocabulary = buildVocabularyFromProfiles(allImageProfilesForVocab);

    const targetUserTextProfile = extractTagsAndWeights(targetUser.textTags);
    const targetUserImageProfile = extractTagsAndWeights(targetUser.imagesTags);

    for (const userId in allUserProfiles) {
        if (userId === targetUserId) continue; // Bỏ qua chính người dùng đó

        const currentUserProfile = allUserProfiles[userId];
        const currentUserTextProfile = extractTagsAndWeights(currentUserProfile.textTags);
        const currentUserImageProfile = extractTagsAndWeights(currentUserProfile.imagesTags);

        // Tính toán độ tương đồng cho hồ sơ văn bản và hình ảnh
        const textSimilarity = calculateCosineSimilarity(
            targetUserTextProfile,
            currentUserTextProfile,
            textVocabulary
        );
        const imageSimilarity = calculateCosineSimilarity(
            targetUserImageProfile,
            currentUserImageProfile,
            imageVocabulary
        );

        // Kết hợp độ tương đồng (có thể điều chỉnh trọng số nếu cần)
        const combinedSimilarity = (textSimilarity + imageSimilarity) / 2; // Ví dụ: lấy trung bình

        if (combinedSimilarity > 0) { // Chỉ thêm nếu có độ tương đồng
            similarities.push({ userId: userId, similarity: combinedSimilarity
            });
        }
    }

    // Sắp xếp theo độ tương đồng giảm dần và lấy top N
    similarities.sort((a, b) => b.similarity - a.similarity);
    return similarities.slice(0, topN);
}

function recommendationsCF() {
    
}

export {
    findSimilarUsers,
};