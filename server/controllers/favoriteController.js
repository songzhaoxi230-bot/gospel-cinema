const Favorite = require('../models/Favorite');
const User = require('../models/User');

// 添加收藏
exports.addFavorite = (req, res) => {
  try {
    const { movieId, movieTitle, moviePoster, movieRating, movieCategory, movieYear, movieType } = req.body;
    const userId = req.user.userId;

    // 验证参数
    if (!movieId || !movieTitle) {
      return res.status(400).json({
        success: false,
        message: '电影ID和标题不能为空'
      });
    }

    // 检查用户是否存在
    const user = User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }

    // 检查是否已收藏
    if (Favorite.isFavorited(userId, movieId)) {
      return res.status(400).json({
        success: false,
        message: '该电影已收藏'
      });
    }

    // 创建收藏
    const favorite = new Favorite({
      userId,
      movieId,
      movieTitle,
      moviePoster,
      movieRating: movieRating || 0,
      movieCategory: movieCategory || '未分类',
      movieYear: movieYear || new Date().getFullYear(),
      movieType: movieType || 'movie'
    });

    favorite.save();

    res.status(201).json({
      success: true,
      message: '收藏成功',
      favorite: favorite
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '添加收藏失败',
      error: error.message
    });
  }
};

// 删除收藏
exports.removeFavorite = (req, res) => {
  try {
    const { movieId } = req.params;
    const userId = req.user.userId;

    // 验证参数
    if (!movieId) {
      return res.status(400).json({
        success: false,
        message: '电影ID不能为空'
      });
    }

    // 删除收藏
    Favorite.deleteByUserAndMovie(userId, movieId);

    res.json({
      success: true,
      message: '取消收藏成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '删除收藏失败',
      error: error.message
    });
  }
};

// 获取用户的所有收藏
exports.getUserFavorites = (req, res) => {
  try {
    const userId = req.user.userId;

    // 检查用户是否存在
    const user = User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }

    // 获取收藏列表
    const favorites = Favorite.findByUserId(userId);

    res.json({
      success: true,
      message: '获取收藏列表成功',
      data: favorites,
      count: favorites.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取收藏列表失败',
      error: error.message
    });
  }
};

// 检查电影是否已收藏
exports.checkFavorite = (req, res) => {
  try {
    const { movieId } = req.params;
    const userId = req.user.userId;

    if (!movieId) {
      return res.status(400).json({
        success: false,
        message: '电影ID不能为空'
      });
    }

    const isFavorited = Favorite.isFavorited(userId, movieId);

    res.json({
      success: true,
      isFavorited: isFavorited
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '检查收藏状态失败',
      error: error.message
    });
  }
};

// 获取收藏数量
exports.getFavoriteCount = (req, res) => {
  try {
    const userId = req.user.userId;

    const count = Favorite.countByUserId(userId);

    res.json({
      success: true,
      count: count
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取收藏数量失败',
      error: error.message
    });
  }
};

// 批量删除收藏
exports.removeBatchFavorites = (req, res) => {
  try {
    const { movieIds } = req.body;
    const userId = req.user.userId;

    if (!Array.isArray(movieIds) || movieIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: '电影ID列表不能为空'
      });
    }

    // 删除所有指定的收藏
    movieIds.forEach(movieId => {
      Favorite.deleteByUserAndMovie(userId, movieId);
    });

    res.json({
      success: true,
      message: `成功删除 ${movieIds.length} 个收藏`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '批量删除收藏失败',
      error: error.message
    });
  }
};

// 清空所有收藏
exports.clearAllFavorites = (req, res) => {
  try {
    const userId = req.user.userId;

    const count = Favorite.countByUserId(userId);
    const userFavorites = Favorite.findByUserId(userId);
    
    userFavorites.forEach(favorite => {
      Favorite.delete(favorite.id);
    });

    res.json({
      success: true,
      message: `已清空所有 ${count} 个收藏`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '清空收藏失败',
      error: error.message
    });
  }
};

