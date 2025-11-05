const Recommendation = require('../models/Recommendation');
const WatchHistory = require('../models/WatchHistory');
const Favorite = require('../models/Favorite');
const { movies, animations } = require('../data/movies');

// 获取推荐电影
exports.getRecommendations = (req, res) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;

    let recommendations = Recommendation.findByUserId(userId, 100);

    // 如果没有推荐，生成新的
    if (recommendations.length === 0) {
      const watchHistory = WatchHistory.findByUserId(userId);
      const allMovies = [...movies, ...animations];
      recommendations = Recommendation.generateRecommendations(userId, watchHistory, allMovies);
    }

    const total = recommendations.length;
    const data = recommendations.slice(offset, offset + limit);

    res.json({
      success: true,
      message: '获取推荐成功',
      data,
      total,
      limit,
      offset
    });
  } catch (error) {
    console.error('获取推荐失败:', error);
    res.status(500).json({
      success: false,
      message: '获取推荐失败',
      error: error.message
    });
  }
};

// 生成推荐
exports.generateRecommendations = (req, res) => {
  try {
    const userId = req.user.id;

    // 清除旧推荐
    Recommendation.deleteByUserId(userId);

    // 获取观看历史
    const watchHistory = WatchHistory.findByUserId(userId);
    const allMovies = [...movies, ...animations];

    // 生成新推荐
    const recommendations = Recommendation.generateRecommendations(userId, watchHistory, allMovies);

    res.json({
      success: true,
      message: '推荐已生成',
      data: recommendations
    });
  } catch (error) {
    console.error('生成推荐失败:', error);
    res.status(500).json({
      success: false,
      message: '生成推荐失败',
      error: error.message
    });
  }
};

// 获取基于类别的推荐
exports.getRecommendationsByCategory = (req, res) => {
  try {
    const userId = req.user.id;
    const { category } = req.params;
    const limit = parseInt(req.query.limit) || 10;

    const allMovies = [...movies, ...animations];
    const categoryMovies = allMovies.filter(m => m.category === category);

    // 获取用户已看过的电影
    const watchHistory = WatchHistory.findByUserId(userId);
    const watchedIds = new Set(watchHistory.map(h => h.movieId));
    const favorites = Favorite.findByUserId(userId);
    const favoriteIds = new Set(favorites.map(f => f.movieId));

    // 推荐未看过的电影
    const recommendations = categoryMovies
      .filter(m => !watchedIds.has(m.id) && !favoriteIds.has(m.id))
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, limit)
      .map(m => ({
        movieId: m.id,
        movieTitle: m.title,
        moviePoster: m.poster,
        movieCategory: m.category,
        movieType: m.type,
        reason: `基于${category}类别的推荐`,
        score: m.rating || 0
      }));

    res.json({
      success: true,
      message: '获取分类推荐成功',
      data: recommendations
    });
  } catch (error) {
    console.error('获取分类推荐失败:', error);
    res.status(500).json({
      success: false,
      message: '获取分类推荐失败',
      error: error.message
    });
  }
};

// 获取热门推荐
exports.getPopularRecommendations = (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;

    const allMovies = [...movies, ...animations];
    const popular = allMovies
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, limit)
      .map(m => ({
        movieId: m.id,
        movieTitle: m.title,
        moviePoster: m.poster,
        movieCategory: m.category,
        movieType: m.type,
        reason: '热门推荐',
        score: m.rating || 0
      }));

    res.json({
      success: true,
      message: '获取热门推荐成功',
      data: popular
    });
  } catch (error) {
    console.error('获取热门推荐失败:', error);
    res.status(500).json({
      success: false,
      message: '获取热门推荐失败',
      error: error.message
    });
  }
};

// 获取新上映推荐
exports.getNewRecommendations = (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;

    const allMovies = [...movies, ...animations];
    const newMovies = allMovies
      .sort((a, b) => (b.year || 0) - (a.year || 0))
      .slice(0, limit)
      .map(m => ({
        movieId: m.id,
        movieTitle: m.title,
        moviePoster: m.poster,
        movieCategory: m.category,
        movieType: m.type,
        reason: '新上映推荐',
        score: m.rating || 0
      }));

    res.json({
      success: true,
      message: '获取新上映推荐成功',
      data: newMovies
    });
  } catch (error) {
    console.error('获取新上映推荐失败:', error);
    res.status(500).json({
      success: false,
      message: '获取新上映推荐失败',
      error: error.message
    });
  }
};

// 获取相似电影推荐
exports.getSimilarMovies = (req, res) => {
  try {
    const { movieId } = req.params;
    const limit = parseInt(req.query.limit) || 10;

    const allMovies = [...movies, ...animations];
    const movie = allMovies.find(m => m.id === movieId);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: '电影不存在'
      });
    }

    // 查找相同类别的电影
    const similar = allMovies
      .filter(m => m.id !== movieId && m.category === movie.category)
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, limit)
      .map(m => ({
        movieId: m.id,
        movieTitle: m.title,
        moviePoster: m.poster,
        movieCategory: m.category,
        movieType: m.type,
        reason: `与《${movie.title}》类似`,
        score: m.rating || 0
      }));

    res.json({
      success: true,
      message: '获取相似电影成功',
      data: similar
    });
  } catch (error) {
    console.error('获取相似电影失败:', error);
    res.status(500).json({
      success: false,
      message: '获取相似电影失败',
      error: error.message
    });
  }
};

// 删除推荐
exports.deleteRecommendation = (req, res) => {
  try {
    const { recommendationId } = req.params;
    const userId = req.user.id;

    Recommendation.delete(recommendationId);

    res.json({
      success: true,
      message: '推荐已删除'
    });
  } catch (error) {
    console.error('删除推荐失败:', error);
    res.status(500).json({
      success: false,
      message: '删除推荐失败',
      error: error.message
    });
  }
};

