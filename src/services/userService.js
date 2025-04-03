import User from "../models/User.js";
import Group from "../models/Group.js";
import { groupService } from "./groupService.js";
import { articleService } from "./articleService.js";
import collectionService from "./collectionService.js"
import Article from "../models/Article.js";
import Location from "../models/Location.js";

const getUsers = async () => {
  // Lấy tất cả người dùng và populate trường 'friends' và 'avt'
  const users = await User.find()
    .populate({
      path: 'friends', // Populate danh sách bạn bè
      select: '_id displayName avt aboutMe' // Chỉ lấy các trường cần thiết
    })
    .populate('avt'); // Populate trường avatar nếu cần

  // Trả về danh sách người dùng đã được populate
  return users.map(user => ({
    _id: user._id,
    displayName: user.displayName,
    avt: user.avt,
    aboutMe: user.aboutMe,
  }));
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
            return true; 
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
            updateDate: item.updateDate,
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
const updateUserSetting = async (id, settingData) => {
  try {
    return await User.findByIdAndUpdate(
      id,
      { $set: { setting: settingData } },
      { new: true, runValidators: true, projection: { setting: 1 } } // Chỉ trả về trường setting
    );
  } catch (error) {
    throw new Error('Lỗi khi cập nhật setting của người dùng');
  }
};

const getAllFriends = async (id) => {
  const user = await  User.findById(id);

  const allFriends = await Promise.all(
    user.friends.map(async (friend) => {
      const FriendData = await User.findById(friend)
        .populate('avt')
      return {
        _id: FriendData._id,
        displayName: FriendData.displayName,
        avt: FriendData.avt,
        aboutMe: FriendData.aboutMe
      }
    })
  );

  return allFriends;
};

const unFriends = async (id, friendId) => {
  await Promise.all([
    User.findByIdAndUpdate(id, { $pull: { friends: friendId } }),
    User.findByIdAndUpdate(friendId, { $pull: { friends: id } }),
  ]);

  return { message: "Unfriended successfully" };
};

const suggestFriends = async (id) => {
  const user = await User.findById(id);
  if (!user) throw new Error("User not found");

  const userFriendsSet = new Set(user.friends.map((f) => f.toString()));
  userFriendsSet.add(id); 

  const friendCounts = {};

  await Promise.all(
    user.friends.map(async (friendId) => {
      const friend = await User.findById(friendId);
      if (friend) {
        friend.friends.forEach((friendOfFriendId) => {
          const friendOfFriendStr = friendOfFriendId.toString();
          if (!userFriendsSet.has(friendOfFriendStr)) {
            friendCounts[friendOfFriendStr] = (friendCounts[friendOfFriendStr] || 0) + 1;
          }
        });
      }
    })
  );

  // Chuyển danh sách thành mảng và sắp xếp theo số lần trùng lặp (giảm dần)
  const suggestedFriends = Object.entries(friendCounts)
    .map(([friendId, count]) => ({ friendId, count }))
    .sort((a, b) => b.count - a.count);

    const result = await Promise.all(
      suggestedFriends.map(async (item) => {
        const friend = await User.findById(item.friendId)
          .populate('avt')
        if (friend) {
          return {
            friend: {
              _id: friend._id,
              displayName: friend.displayName,
              avt: friend.avt,
              aboutMe: friend.aboutMe
            },
            count: item.count
          }
        }
      })
    );
  return result;
};

const addHobbyByEmail = async (email, hobbies) => {
  try {
    // Kiểm tra đầu vào
    if (!email || !Array.isArray(hobbies) || hobbies.length === 0) {
      throw new Error("Vui lòng cung cấp email và danh sách hobbies hợp lệ.");
    }

    // Tìm `account` theo `email`
    const account = await Account.findOne({ email });
    if (!account) {
      throw new Error("Tài khoản không tồn tại.");
    }

    // Tìm `user` theo `account._id`
    const user = await User.findOne({ account: account._id });
    if (!user) {
      throw new Error("Người dùng không tồn tại.");
    }

    // Kiểm tra xem sở thích đã có trong database chưa
    const existingHobbies = await Hobby.find({ name: { $in: hobbies } });

    // Lọc ra các hobby đã tồn tại
    const existingHobbyIds = existingHobbies.map(hobby => hobby._id);
    const existingNames = existingHobbies.map(hobby => hobby.name);

    // Tạo mới các hobby chưa có trong database
    const newHobbies = hobbies
      .filter(hobby => !existingNames.includes(hobby))
      .map(name => ({ name }));

    let insertedHobbies = [];
    if (newHobbies.length > 0) {
      insertedHobbies = await Hobby.insertMany(newHobbies);
    }

    // Lấy danh sách ID của các hobby mới thêm
    const allHobbyIds = [...existingHobbyIds, ...insertedHobbies.map(hobby => hobby._id)];

    // Kiểm tra xem user đã có những sở thích này chưa
    const hobbiesToAdd = allHobbyIds.filter(hobbyId => !user.hobbies.includes(hobbyId));

    if (hobbiesToAdd.length === 0) {
      throw new Error("Người dùng đã có những sở thích này.");
    }

    // Cập nhật danh sách sở thích của user
    user.hobbies.push(...hobbiesToAdd);
    await user.save();

    return { user, message: "Thêm sở thích thành công!" };
  } catch (error) {
    throw new Error(error.message || "Lỗi hệ thống, vui lòng thử lại.");
  }
};

const getCreatedPages =  async (userId, limit = 5, skip = 0) => {
  // Chuyển đổi limit và skip thành số nguyên
  const limitNum = parseInt(limit, 10);
  const skipNum = parseInt(skip, 10);

  // Tìm user và populate createPages
  const user = await User.findById(userId)
    .populate('pages.createPages') // Populate danh sách Page từ createPages
    .lean(); // Chuyển thành plain object để xử lý dễ hơn

  if (!user) {
    return null; // Trả về null nếu không tìm thấy user
  }

  // Lấy danh sách createPages
  let listPages = user.pages?.createPages || [];

  // Sắp xếp theo số lượng follower (tùy chọn, tương tự getHotPage)
  listPages = listPages.sort((a, b) => (b.follower?.length || 0) - (a.follower?.length || 0));

  // Áp dụng phân trang
  listPages = listPages.slice(skipNum, skipNum + limitNum);

  return listPages;
}

const addSavedLocation = async (userId, savedLocation) => {
  const newLocation = await Location.create(savedLocation);

  if (!newLocation) return {success: false, message: "Không thể tạo địa điểm mới"};

  const updateUser = await User.findByIdAndUpdate(
    userId,
    { $push: { savedLocation: newLocation._id } },
    { new: true }
  );

  if (!updateUser) {
    return { success: false, message: "Không thể cập nhật người dùng" };
  }

  return { success: true, message: "Đã thêm địa điểm", user: updateUser };
}

const deleteSavedLocation = async (userId, savedId) => {
  const deletedLocation = await Location.findByIdAndDelete(savedId);

  if (!deletedLocation) {
    return { success: false, message: "Không tìm thấy địa điểm" };
  }

  const updateUser = await User.findByIdAndUpdate(
    userId,
    { $pull: { savedLocation: savedId } },
    { new: true }
  );

  if (!updateUser) {
    return { success: false, message: "Không thể cập nhật người dùng" };
  }

  return { success: true, message: "Đã xóa địa điểm", user: updateUser };
};

const getAllSavedLocation = async (userId) => {
  const user = await User.findById(userId).select('savedLocation').populate('savedLocation');
  
  if (!user) {
    return { success: false, message: "Không tìm thấy người dùng", savedLocations: [] };
  }

  return { success: true, savedLocations: user.savedLocation };
};

const checkSavedLocation = async (userId, location) => {
  const user = await User.findById(userId).select('savedLocation');

  if (!user) {
    return { success: false, message: "Không tìm thấy người dùng", saved: false };
  }

  // Kiểm tra xem có location nào có latitude & longitude trùng khớp không
  const savedLocation = await Location.findOne({
    _id: { $in: user.savedLocation },
    latitude: location.latitude,
    longitude: location.longitude,
  });

  return { 
    success: true, 
    saved: !!savedLocation, 
    savedLocation 
  };
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
  getAllCollection,
  updateUserSetting,
  getAllFriends,
  unFriends,
  suggestFriends,
  addHobbyByEmail,
  getCreatedPages,
  addSavedLocation,
  deleteSavedLocation,
  getAllSavedLocation,
  checkSavedLocation
};
