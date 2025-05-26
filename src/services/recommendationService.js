import User from '../models/User.js';
import Article from '../models/Article.js';
import HistoryArticle from '../models/HistoryArticle.js';
import ArticleTags from '../models/ArticleTags.js';
import Comment from '../models/Comment.js';
import mongoose from 'mongoose';

const filterArticlesByScope = async (userId, articles) => {
  const user = await User.findById(userId).populate('friends').lean();
  if (!user) return [];

  // Đảm bảo user.friends là mảng, nếu không thì trả về mảng rỗng
  const friends = Array.isArray(user.friends) ? user.friends : [];

  return articles.filter(article => {
    if (!article.createdBy || !article.createdBy._id) {
      console.warn('Article missing createdBy or createdBy._id:', article._id);
      return false;
    }

    const scope = article.scope || 'Công khai';
    if (scope === 'Công khai') return true;
    if (
      scope === 'Bạn bè' &&
      friends.some(friend => friend._id.toString() === article.createdBy._id.toString())
    )
      return true;
    if (scope === 'Riêng tư' && article.createdBy._id.toString() === userId.toString()) return true;
    return false;
  });
};

// --- Content-Based Filtering (CBF) ---
const buildUserTagProfile = async (userId) => {
  const history = await HistoryArticle.find({ idUser: userId }).lean();
  const interactedArticleIds = history.map(h => h.idArticle);

  const userArticleTags = await ArticleTags.find({ idArticle: { $in: interactedArticleIds } }).lean();

  const tagProfile = {};

  userArticleTags.forEach(at => {
    // Tag text weight = 1
    at.textTag.forEach(tag => {
      tagProfile[tag] = (tagProfile[tag] || 0) + 1;
    });
    // Tag hình ảnh có trọng số weight riêng
    at.imagesTag.forEach(imgTag => {
      tagProfile[imgTag.tag] = (tagProfile[imgTag.tag] || 0) + imgTag.weight;
    });
  });

  return tagProfile;
};

// Tính điểm tương đồng tag giữa bài viết và profile user
const scoreArticleByTags = (articleTags, userTagProfile) => {
  if (!articleTags) return 0;
  let score = 0;
  articleTags.textTag.forEach(tag => {
    if (userTagProfile[tag]) score += userTagProfile[tag];
  });
  articleTags.imagesTag.forEach(imgTag => {
    if (userTagProfile[imgTag.tag]) score += userTagProfile[imgTag.tag] * imgTag.weight;
  });
  return score;
};

// --- Collaborative Filtering (CF) ---
const calculateCollaborativeScore = async (userId, articles, user) => {
  // Đảm bảo user.friends và user.following là mảng, nếu không thì trả về mảng rỗng
  const friendIds = Array.isArray(user.friends) ? user.friends.map(f => f._id.toString()) : [];
  const followingIds = Array.isArray(user.following) ? user.following.map(f => f._id.toString()) : [];

  // Tập hợp user chính + bạn bè + following
  const interactedUsers = [userId, ...friendIds, ...followingIds];

  // Lấy lịch sử tương tác của các user này
  const interactions = await HistoryArticle.find({
    idUser: { $in: interactedUsers }
  }).lean();

  const scores = {};
  interactions.forEach(h => {
    const articleId = h.idArticle.toString();
    // View cho điểm thấp hơn Like (hoặc các hành động khác)
    let baseScore = h.action === 'View' ? 1 : 2;

    // Tương tác của user chính có trọng số cao hơn bạn bè/following
    if (h.idUser.toString() === userId) baseScore *= 2;
    else baseScore *= 0.5;

    scores[articleId] = (scores[articleId] || 0) + baseScore;
  });

  // Trả về map điểm cho bài viết trong danh sách articles
  return articles.reduce((acc, a) => {
    acc[a._id.toString()] = scores[a._id.toString()] || 0;
    return acc;
  }, {});
};

const recommend = async (userId, page = 1, limit = 10) => {
  // Lấy user và các quan hệ cần thiết
  const user = await User.findById(userId)
    .populate([
      'hobbies',
      'friends',
      'following',
      'groups.createGroups',
      'groups.saveGroups',
      'pages.createPages',
      'pages.followerPages',
    ])
    .lean();

  if (!user) throw new Error('Người dùng không tồn tại');

  // Lấy tất cả bài viết chưa xóa
  let allArticles = await Article.find({ _destroy: null }).lean();
  if (!Array.isArray(allArticles)) {
    console.warn('No articles found or query failed');
    return {
      articles: [],
      total: 0,
      totalPages: 0,
      currentPage: page,
      scoredArticlesDetails: [],
    };
  }

  // Lọc bài viết theo quyền xem (scope)
  allArticles = await filterArticlesByScope(userId, allArticles);

  // Nếu không còn bài viết nào sau khi lọc, trả về kết quả rỗng
  if (!Array.isArray(allArticles) || allArticles.length === 0) {
    return {
      articles: [],
      total: 0,
      totalPages: 0,
      currentPage: page,
      scoredArticlesDetails: [],
    };
  }

  // Lấy tags của tất cả bài viết đã lọc
  const articleIds = allArticles.map(a => a._id);
  const articleTagsList = await ArticleTags.find({ idArticle: { $in: articleIds } }).lean();
  const articleTagsMap = new Map();
  articleTagsList.forEach(at => articleTagsMap.set(at.idArticle.toString(), at));

  // Xây dựng profile tag của user dựa trên các bài đã tương tác
  const userTagProfile = await buildUserTagProfile(userId);

  // Lấy danh sách các bài user đã comment
  const comments = await Comment.find({ _iduser: userId }).lean();
  const commentedArticleIds = comments
    .map(c => c.articleId)
    .filter(id => id != null)
    .map(id => id.toString());

  const COMMENT_BOOST = 5;
  const ALPHA = 0.6;

  // Tính điểm Collaborative Filtering trên toàn bộ bài viết
  const collaborativeScores = await calculateCollaborativeScore(userId, allArticles, user);

  // Tính điểm kết hợp cho từng bài viết
  const scoredArticles = allArticles.map(article => {
    const idStr = article._id.toString();
    const at = articleTagsMap.get(idStr);

    // Điểm content-based dựa trên tags
    const contentScore = scoreArticleByTags(at, userTagProfile);
    // Điểm collaborative filtering dựa trên hành vi tương tác
    const collabScore = collaborativeScores[idStr] || 0;
    // Tăng điểm nếu user đã comment bài này
    const commentScore = commentedArticleIds.includes(idStr) ? COMMENT_BOOST : 0;

    // Tổng điểm cuối cùng kết hợp content, collaborative và comment boost
    const finalScore = ALPHA * contentScore + (1 - ALPHA) * collabScore + commentScore;

    return { article, score: finalScore, detail: { contentScore, collabScore, commentScore } };
  });

  // Sắp xếp toàn bộ bài viết theo điểm giảm dần
  scoredArticles.sort((a, b) => b.score - a.score);

  // Phân trang trên kết quả đã sắp xếp
  const totalArticlesCount = scoredArticles.length;
  const totalPages = Math.ceil(totalArticlesCount / limit);
  const startIndex = (page - 1) * limit;
  const pagedArticleScores = scoredArticles.slice(startIndex, startIndex + limit);

  // Lấy _id của các bài viết đã được phân trang và sắp xếp
  const finalArticleIds = pagedArticleScores.map(s => s.article._id);

  // Populate các bài viết đã chọn với tất cả các trường cần thiết
  const populatedArticles = await Article.find({ _id: { $in: finalArticleIds } })
    .populate({
      path: 'createdBy',
      select: '_id displayName avt',
      populate: {
        path: 'avt',
        select: '_id name idAuthor type url createdAt updatedAt',
      },
    })
    .populate({
      path: 'listPhoto',
      select: '_id name idAuthor type url createdAt updatedAt',
      populate: {
        path: 'idAuthor',
        select: '_id displayName avt',
      },
    })
    .populate({
      path: 'groupID',
      select: '_id groupName',
    })
    .populate({
      path: 'address',
      select: '_id province district ward street placeName lat long',
    })
    .lean();

  // Tạo một Map để giữ nguyên thứ tự sắp xếp theo điểm ban đầu
  const populatedArticlesMap = new Map(populatedArticles.map(art => [art._id.toString(), art]));
  const articlesInDesiredOrder = finalArticleIds.map(id => populatedArticlesMap.get(id.toString()));

  return {
    articles: articlesInDesiredOrder.filter(Boolean),
    total: totalArticlesCount,
    totalPages,
    currentPage: page,
    scoredArticlesDetails: pagedArticleScores.map(s => ({
      articleId: s.article._id.toString(),
      contentScore: s.detail.contentScore,
      collaborativeScore: s.detail.collabScore,
      commentScore: s.detail.commentScore,
      finalScore: s.score,
    })),
  };
};

export const recommendationService = {
  recommend,
};