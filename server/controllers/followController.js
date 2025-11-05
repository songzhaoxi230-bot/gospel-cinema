const Follow = require('../models/Follow');
const User = require('../models/User');

// 关注用户
exports.followUser = (req, res) => {
  try {
    const { followingId } = req.body;
    const followerId = req.user.id;

    if (!followingId) {
      return res.status(400).json({
        success: false,
        message: '缺少被关注用户ID'
      });
    }

    if (followerId === followingId) {
      return res.status(400).json({
        success: false,
        message: '不能关注自己'
      });
    }

    // 检查被关注用户是否存在
    const followingUser = User.findById(followingId);
    if (!followingUser) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }

    // 检查是否已关注
    if (Follow.isFollowing(followerId, followingId)) {
      return res.status(400).json({
        success: false,
        message: '已经关注过此用户'
      });
    }

    const follow = new Follow({
      followerId,
      followingId
    });

    follow.save();

    res.json({
      success: true,
      message: '关注成功',
      data: follow
    });
  } catch (error) {
    console.error('关注失败:', error);
    res.status(500).json({
      success: false,
      message: '关注失败',
      error: error.message
    });
  }
};

// 取消关注
exports.unfollowUser = (req, res) => {
  try {
    const { followingId } = req.params;
    const followerId = req.user.id;

    if (!followingId) {
      return res.status(400).json({
        success: false,
        message: '缺少被关注用户ID'
      });
    }

    if (!Follow.isFollowing(followerId, followingId)) {
      return res.status(400).json({
        success: false,
        message: '未关注此用户'
      });
    }

    Follow.unfollow(followerId, followingId);

    res.json({
      success: true,
      message: '取消关注成功'
    });
  } catch (error) {
    console.error('取消关注失败:', error);
    res.status(500).json({
      success: false,
      message: '取消关注失败',
      error: error.message
    });
  }
};

// 检查是否关注
exports.checkFollowing = (req, res) => {
  try {
    const { followingId } = req.params;
    const followerId = req.user.id;

    const isFollowing = Follow.isFollowing(followerId, followingId);

    res.json({
      success: true,
      message: '检查成功',
      data: { isFollowing }
    });
  } catch (error) {
    console.error('检查关注状态失败:', error);
    res.status(500).json({
      success: false,
      message: '检查关注状态失败',
      error: error.message
    });
  }
};

// 获取关注列表
exports.getFollowing = (req, res) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;

    const followingIds = Follow.getFollowing(userId);
    const total = followingIds.length;
    const followingList = followingIds
      .slice(offset, offset + limit)
      .map(id => {
        const user = User.findById(id);
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar || 'https://via.placeholder.com/40'
        };
      });

    res.json({
      success: true,
      message: '获取关注列表成功',
      data: followingList,
      total,
      limit,
      offset
    });
  } catch (error) {
    console.error('获取关注列表失败:', error);
    res.status(500).json({
      success: false,
      message: '获取关注列表失败',
      error: error.message
    });
  }
};

// 获取粉丝列表
exports.getFollowers = (req, res) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;

    const followerIds = Follow.getFollowers(userId);
    const total = followerIds.length;
    const followersList = followerIds
      .slice(offset, offset + limit)
      .map(id => {
        const user = User.findById(id);
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar || 'https://via.placeholder.com/40'
        };
      });

    res.json({
      success: true,
      message: '获取粉丝列表成功',
      data: followersList,
      total,
      limit,
      offset
    });
  } catch (error) {
    console.error('获取粉丝列表失败:', error);
    res.status(500).json({
      success: false,
      message: '获取粉丝列表失败',
      error: error.message
    });
  }
};

// 获取关注统计
exports.getFollowStats = (req, res) => {
  try {
    const userId = req.user.id;

    const followerCount = Follow.getFollowerCount(userId);
    const followingCount = Follow.getFollowingCount(userId);

    res.json({
      success: true,
      message: '获取关注统计成功',
      data: {
        followerCount,
        followingCount
      }
    });
  } catch (error) {
    console.error('获取关注统计失败:', error);
    res.status(500).json({
      success: false,
      message: '获取关注统计失败',
      error: error.message
    });
  }
};

// 获取用户的粉丝列表（公开）
exports.getUserFollowers = (req, res) => {
  try {
    const { userId } = req.params;
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;

    const followerIds = Follow.getFollowers(userId);
    const total = followerIds.length;
    const followersList = followerIds
      .slice(offset, offset + limit)
      .map(id => {
        const user = User.findById(id);
        return {
          id: user.id,
          name: user.name,
          avatar: user.avatar || 'https://via.placeholder.com/40'
        };
      });

    res.json({
      success: true,
      message: '获取用户粉丝列表成功',
      data: followersList,
      total,
      limit,
      offset
    });
  } catch (error) {
    console.error('获取用户粉丝列表失败:', error);
    res.status(500).json({
      success: false,
      message: '获取用户粉丝列表失败',
      error: error.message
    });
  }
};

// 获取用户的关注列表（公开）
exports.getUserFollowing = (req, res) => {
  try {
    const { userId } = req.params;
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;

    const followingIds = Follow.getFollowing(userId);
    const total = followingIds.length;
    const followingList = followingIds
      .slice(offset, offset + limit)
      .map(id => {
        const user = User.findById(id);
        return {
          id: user.id,
          name: user.name,
          avatar: user.avatar || 'https://via.placeholder.com/40'
        };
      });

    res.json({
      success: true,
      message: '获取用户关注列表成功',
      data: followingList,
      total,
      limit,
      offset
    });
  } catch (error) {
    console.error('获取用户关注列表失败:', error);
    res.status(500).json({
      success: false,
      message: '获取用户关注列表失败',
      error: error.message
    });
  }
};

