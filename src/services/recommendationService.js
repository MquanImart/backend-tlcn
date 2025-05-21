// services/recommendationService.js
import User from '../models/User.js';
import Article from '../models/Article.js';
import HistoryArticle from '../models/HistoryArticle.js';
import Comment from '../models/Comment.js';
import Collection from '../models/Collection.js';
import { jaccardSimilarity } from '../utils/similarity.js';

const fetchData = async (userId, page, limit) => {
  const skip = (page - 1) * limit;

  const user = await User.findById(userId)
    .populate('hobbies friends following pages.createPages pages.followerPages groups.createGroups groups.saveGroups')
    .lean();

  if (!user) {
    throw new Error('Người dùng không tồn tại');
  }

  const totalArticlesCount = await Article.countDocuments({ _destroy: null });

  const articles = await Article.find({ _destroy: null })
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
      select: '_id province district ward street streetName lat long',
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const history = await HistoryArticle.find({ idUser: userId }).lean();
  const comments = await Comment.find({ _iduser: userId }).lean();

  const articleIdsOnPage = articles.map(a => a._id);
  const collections = await Collection.find({ 'items._id': { $in: articleIdsOnPage } }).lean();



  return { user, articles, history, comments, collections, totalArticlesCount };
};

const filterArticlesByScope = async (userId, articles) => {
  const user = await User.findById(userId).populate('friends').lean();
  if (!user) return [];

  return articles.filter(article => {
    if (!article.createdBy || !article.createdBy._id) {
      console.warn('Article missing createdBy or createdBy._id:', article._id);
      return false;
    }

    if (article.scope === 'Công khai') return true;
    if (article.scope === 'Bạn bè' && user.friends.some(friend => friend._id.toString() === article.createdBy._id.toString())) return true;
    if (article.scope === 'Riêng tư' && article.createdBy._id.toString() === userId.toString()) return true;
    return false;
  });
};

const calculateContentBasedScore = (user, article) => {
  const userFeatures = [
    ...user.hobbies.map(h => `hobby:${h._id.toString()}`),
    ...[...user.groups.createGroups, ...user.groups.saveGroups].map(g => `group:${g._id.toString()}`),
    ...[...user.pages.createPages, ...user.pages.followerPages].map(p => `page:${p._id.toString()}`),
    ...user.following.map(f => `following:${f._id.toString()}`)
  ];
  const articleFeatures = [
    ...(article.groupID ? [`group:${article.groupID._id.toString()}`] : []),
    `creator:${article.createdBy._id.toString()}`
  ];
  return jaccardSimilarity(userFeatures, articleFeatures);
};

const calculateCollaborativeScore = async (userId, articles, history, comments, collections, user) => {
  const scores = {};
  const friendIds = user.friends.map(f => f._id.toString());
  const followingIds = user.following.map(f => f._id.toString());

  history.forEach(h => {
    const articleId = h.idArticle.toString();
    scores[articleId] = (scores[articleId] || 0) + (h.action === 'View' ? 1 : 2);
  });
  comments.forEach(c => {
    scores[c._id.toString()] = (scores[c._id.toString()] || 0) + 3;
  });
  collections.forEach(collection => {
    collection.items.forEach(item => {
      if (articles.some(a => a._id.toString() === item._id.toString())) {
        scores[item._id.toString()] = (scores[item._id.toString()] || 0) + 4;
      }
    });
  });

  const friendHistory = await HistoryArticle.find({
    idUser: { $in: [...friendIds, ...followingIds] }
  }).lean();
  friendHistory.forEach(h => {
    const articleId = h.idArticle.toString();
    if (articles.some(a => a._id.toString() === articleId)) {
      scores[articleId] = (scores[articleId] || 0) + (h.action === 'View' ? 0.5 : 1);
    }
  });

  return scores;
};

const recommend = async (userId, page = 1, limit = 5) => {
  const { user, articles, history, comments, collections, totalArticlesCount } = await fetchData(userId, page, limit);

  const filteredArticles = await filterArticlesByScope(userId, articles);

  const totalPages = Math.ceil(totalArticlesCount / limit);

  if (filteredArticles.length === 0 && totalArticlesCount > 0 && page <= totalPages) {
    return { articles: [], totalPages: totalPages, currentPage: page };
  } else if (totalArticlesCount === 0) {
    return { articles: [], totalPages: 0, currentPage: page };
  }

  const collaborativeScores = await calculateCollaborativeScore(userId, filteredArticles, history, comments, collections, user);

  const scores = filteredArticles.map(article => {
    const contentScore = calculateContentBasedScore(user, article);
    const collabScore = collaborativeScores[article._id.toString()] || 0;
    return {
      article,
      score: 0.6 * contentScore + 0.4 * collabScore
    };
  });

  scores.sort((a, b) => b.score - a.score);

  const paginatedArticles = scores.map(s => s.article);

  return {
    articles: paginatedArticles,
    totalPages,
    currentPage: page,
  };
};

export const recommendationService = {
  recommend,
};