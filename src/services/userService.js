import User from "../models/User.js";
import Group from "../models/Group.js";
import { groupService } from "./groupService.js";
import { articleService } from "./articleService.js";
import collectionService from "./collectionService.js"
import Article from "../models/Article.js";
import MyPhoto from "../models/MyPhoto.js";

const getUsers = async () => {
  return await User.find()
};

const getUserById = async (id) => {
  return await User.findOne({ _id: id })
};

const createUser = async (data) => {
  return await User.create(data);
};

const updateUserById = async (id, data) => {
  return await User.findByIdAndUpdate(id, data, { new: true })
};

const updateAllUsers = async (data) => {
  return await User.updateMany({}, data, { new: true });
};

const deleteUserById = async (id) => {
  return await User.findByIdAndUpdate(id, { deleteAt: Date.now() }, { new: true });
};

const getSavedGroups = async (userId) => {
  const user = await User.findById(userId);

  if (!user || !user.groups?.saveGroups) {
    return [];
  }

  const savedGroupIds = user.groups.saveGroups.map((group) => group._id);
  const savedGroups = await Promise.all(savedGroupIds.map(groupService.getGroupById)); 

  return savedGroups.filter((group) => group !== null); // Lọc nhóm hợp lệ
};

const getMyGroups = async (userId) => {
  const user = await User.findById(userId);

  if (!user || !user.groups?.createGroups) {
    return [];
  }

  const savedGroupIds = user.groups.createGroups.map((group) => group._id);
  const savedGroups = await Promise.all(savedGroupIds.map(groupService.getGroupById)); 

  return savedGroups.filter((group) => group !== null); 
};

const getNotJoinedGroups = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) return [];

    const joinedGroupIds = new Set([
      ...(user.groups?.createGroups?.map((group) => group._id.toString()) || []),
      ...(user.groups?.saveGroups?.map((group) => group._id.toString()) || []),
    ]);

    const allGroups = await groupService.getGroups(); 

    const notJoinedGroupIds = allGroups
      .map(group => group._id.toString())
      .filter(groupId => !joinedGroupIds.has(groupId));

    const notJoinedGroups = await Promise.all(notJoinedGroupIds.map(groupService.getGroupById));

    return notJoinedGroups.filter(group => group !== null);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách nhóm chưa tham gia:", error);
    throw new Error(error.message);
  }
}

const getArticleAllGroups = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("Người dùng không tồn tại");
    }

    const savedGroupIds = user.groups?.saveGroups?.map(group => group._id) || [];
    const myGroupIds = user.groups?.createGroups?.map(group => group._id) || [];
    const groupIds = [...savedGroupIds, ...myGroupIds];

    if (!groupIds.length) {
      return [];
    }

    const groups = await Group.find({ _id: { $in: groupIds }, _destroy: null })

    const approvedArticleIds = groups.flatMap(group =>
      group.article
        ?.filter(article => article.state === "approved") 
        .map(article => article.idArticle._id) || []
    );
  
    if (!approvedArticleIds.length) {
      return [];
    }

    const approvedArticles = await Promise.all(
      approvedArticleIds.map(articleId => articleService.getArticleById(articleId))
    );

    return approvedArticles.filter(article => article !== null);

  } catch (error) {
    console.error("Lỗi khi lấy bài viết đã duyệt:", error);
    throw new Error(error.message);
  }
};

const getPhotoAvt = async (userId, query) => {
  const filter = { _destroy: null, idAuthor: userId };
  if (query.type) {
    filter.type = query.type;
  }

  const user = await User.findById(userId)
  .select('displayName _id avt')
  .populate({
    path: 'avt',
    model: 'MyPhoto',
  });

  return user.avt.map((item) => ({
    ...item.toObject(),
    idAuthor: {
      _id: user._id,
      displayName: user.displayName
    },
  }));
  
};

const createCollection = async (userId, name, type) => {
  const newCollection = await collectionService.createCollection({
      name: name,
      item: [],
      type: type
  })

  if (!newCollection) {
    throw new Error("Không thể tạo collection");
  }

  await User.findByIdAndUpdate(
    userId,
    { $push: { collections: newCollection._id } }, 
    { new: true } 
  );

  return newCollection;
};

const deleteCollection = async (userId, collectionId) => {
  const deletedCollection = await collectionService.deleteCollectionById(collectionId);

  if (!deletedCollection) {
    throw new Error("Không thể xóa collection");
  }

  await User.findByIdAndUpdate(
    userId,
    { $pull: { collections: collectionId } },
    { new: true }
  );

  return null;
};

const getAllCollection = async (userId) => {
  const user = await User.findById(userId)
      .populate({
        path: 'collections'
      })
      .lean();
  const defaultImage =
  "https://storage.googleapis.com/kltn-hcmute/public/default/default_article.png";

  return await Promise.all(
    user.collections.map(async (collection) => {
      const allPhotoIds = collection.items.map((item) => item._id)
      const articles = await Article.find({ _id: { $in: allPhotoIds } })
        .populate("listPhoto")
        .lean();

      let representImg = defaultImage;
      articles.some((article) => {
        if (article?.listPhoto?.length > 0) {
          const firstImg = article.listPhoto.find((photo) => photo.type === "img");
          if (firstImg) {
            representImg = firstImg.url;
            return true; // Dừng vòng lặp sớm
          }
        }
        return false;
      });        
      
      return {
        collection: collection,
        imgDefault: representImg
      }
    })
  )
};

const getEarliestItems = async (userId, limit) => {
  const user = await User.findById(userId)
      .populate({
        path: 'collections',
        populate: {
          path: 'items._id', // Nếu items là ObjectId tham chiếu tới một collection khác, bạn cần điều chỉnh ở đây
        },
      })
      .lean();

    if (!user || !user.collections) {
      return [];
    }

    const collectionsArticle = user.collections.filter((item) => item.type === "article")
    let allItems = collectionsArticle.flatMap((collection) =>
      collection.items.map((item) => ({
        ...item,
        collectionId: collection._id, // Gắn collectionId vào từng item
      }))
    );
    allItems = allItems.sort((a, b) => new Date(b.updateDate).getTime() - new Date(a.updateDate).getTime());
    const itemRecent = allItems.slice(0, limit);
    
    if (itemRecent.length > 0) {
      return Promise.all(
        itemRecent.map(async (item) => {
          const article = await Article.findById(item._id);
          const article_expand = await Article.findById(item._id).populate("listPhoto");
          const author = await User.findById(article.createdBy);
    
          let representImg = "https://storage.googleapis.com/kltn-hcmute/public/default/default_article.png";
    
          if (article_expand?.listPhoto?.length > 0) {
            const firstImg = article_expand.listPhoto.find((photo) => photo.type === "img");
            if (firstImg) {
              representImg = firstImg.url;
            }
          }
    
          return {
            article: article,
            updateDate: item.updateDate.getTime(),
            representImg: representImg,
            author: {
              _id: author._id,
              displayName: author.displayName
            },
            collectionId: item.collectionId
          };
        })
      );
    }
    
    return [];
};


export const userService = {
  getUsers,
  getUserById,
  createUser,
  updateUserById,
  updateAllUsers,
  deleteUserById,
  getSavedGroups,
  getMyGroups,
  getNotJoinedGroups,
  getArticleAllGroups,
  getPhotoAvt,
  createCollection,
  deleteCollection,
  getEarliestItems,
  getAllCollection
};
