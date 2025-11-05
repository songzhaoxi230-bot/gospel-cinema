const WatchHistory = require('../models/WatchHistory');

// 记录观看
exports.recordWatch = (req, res) => {
  try {
    const { movieId, movieTitle, moviePoster, movieType, duration, progress } = req.body;
    const userId = req.user.id;

    if (!movieId || !movieTitle) {
      return res.status(400).json({
        success: false,
        message: '缺少必要参数'
      });
    }

    const watchHistory = new WatchHistory({
      userId,
      movieId,
      movieTitle,
      moviePoster,
      movieType,
      duration,
      progress
    });

    watchHistory.save();

    res.json({
      success: true,
      message: '观看记录已保存',
      data: watchHistory
    });
  } catch (error) {
    console.error('记录观看失败:', error);
    res.status(500).json({
      success: false,
      message: '记录观看失败',
      error: error.message
    });
  }
};

// 更新观看进度
exports.updateWatchProgress = (req, res) => {
  try {
    const { movieId, duration, progress } = req.body;
    const userId = req.user.id;

    if (!movieId) {
      return res.status(400).json({
        success: false,
        message: '缺少电影ID'
      });
    }

    let watchHistory = WatchHistory.findByUserIdAndMovieId(userId, movieId);
    
    if (!watchHistory) {
      watchHistory = new WatchHistory({
        userId,
        movieId,
        movieTitle: '',
        moviePoster: '',
        duration,
        progress
      });
    } else {
      watchHistory.duration = duration || watchHistory.duration;
      watchHistory.progress = progress || watchHistory.progress;
      watchHistory.watchedAt = new Date();
    }

    watchHistory.save();

    res.json({
      success: true,
      message: '观看进度已更新',
      data: watchHistory
    });
  } catch (error) {
    console.error('更新观看进度失败:', error);
    res.status(500).json({
      success: false,
      message: '更新观看进度失败',
      error: error.message
    });
  }
};

// 获取观看历史
exports.getWatchHistory = (req, res) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;

    const history = WatchHistory.findByUserId(userId);
    const total = history.length;
    const data = history.slice(offset, offset + limit);

    res.json({
      success: true,
      message: '获取观看历史成功',
      data,
      total,
      limit,
      offset
    });
  } catch (error) {
    console.error('获取观看历史失败:', error);
    res.status(500).json({
      success: false,
      message: '获取观看历史失败',
      error: error.message
    });
  }
};

// 获取单个电影的观看记录
exports.getWatchRecord = (req, res) => {
  try {
    const { movieId } = req.params;
    const userId = req.user.id;

    const watchHistory = WatchHistory.findByUserIdAndMovieId(userId, movieId);

    if (!watchHistory) {
      return res.json({
        success: true,
        message: '未找到观看记录',
        data: null
      });
    }

    res.json({
      success: true,
      message: '获取观看记录成功',
      data: watchHistory
    });
  } catch (error) {
    console.error('获取观看记录失败:', error);
    res.status(500).json({
      success: false,
      message: '获取观看记录失败',
      error: error.message
    });
  }
};

// 删除单个观看记录
exports.deleteWatchRecord = (req, res) => {
  try {
    const { movieId } = req.params;
    const userId = req.user.id;

    WatchHistory.deleteByUserIdAndMovieId(userId, movieId);

    res.json({
      success: true,
      message: '观看记录已删除'
    });
  } catch (error) {
    console.error('删除观看记录失败:', error);
    res.status(500).json({
      success: false,
      message: '删除观看记录失败',
      error: error.message
    });
  }
};

// 清空所有观看历史
exports.clearWatchHistory = (req, res) => {
  try {
    const userId = req.user.id;

    WatchHistory.deleteByUserId(userId);

    res.json({
      success: true,
      message: '观看历史已清空'
    });
  } catch (error) {
    console.error('清空观看历史失败:', error);
    res.status(500).json({
      success: false,
      message: '清空观看历史失败',
      error: error.message
    });
  }
};

// 获取最近观看的电影
exports.getRecentlyWatched = (req, res) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 10;

    const history = WatchHistory.findByUserId(userId);
    const data = history.slice(0, limit);

    res.json({
      success: true,
      message: '获取最近观看成功',
      data
    });
  } catch (error) {
    console.error('获取最近观看失败:', error);
    res.status(500).json({
      success: false,
      message: '获取最近观看失败',
      error: error.message
    });
  }
};

