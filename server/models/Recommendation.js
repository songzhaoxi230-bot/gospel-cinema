const { v4: uuidv4 } = require('uuid');

let recommendations = [];

class Recommendation {
  constructor(data) {
    this.id = uuidv4();
    this.userId = data.userId;
    this.movieId = data.movieId;
    this.movieTitle = data.movieTitle;
    this.moviePoster = data.moviePoster;
    this.movieCategory = data.movieCategory;
    this.movieType = data.movieType || 'movie';
    this.reason = data.reason; // 推荐原因
    this.score = data.score || 0; // 推荐分数
    this.createdAt = new Date();
  }

  save() {
    const existing = recommendations.find(r => r.userId === this.userId && r.movieId === this.movieId);
    if (existing) {
      Object.assign(existing, this);
    } else {
      recommendations.push(this);
    }
    return this;
  }

  static findByUserId(userId, limit = 20) {
    return recommendations
      .filter(r => r.userId === userId)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  static delete(id) {
    recommendations = recommendations.filter(r => r.id !== id);
  }

  static deleteByUserId(userId) {
    recommendations = recommendations.filter(r => r.userId !== userId);
  }

  static deleteByUserIdAndMovieId(userId, movieId) {
    recommendations = recommendations.filter(r => !(r.userId === userId && r.movieId === movieId));
  }

  // 基于观看历史的推荐
  static generateRecommendations(userId, watchHistory, allMovies) {
    const watchedCategories = {};
    const watchedMovies = new Set();

    // 分析观看历史
    watchHistory.forEach(history => {
      watchedMovies.add(history.movieId);
      const movie = allMovies.find(m => m.id === history.movieId);
      if (movie) {
        watchedCategories[movie.category] = (watchedCategories[movie.category] || 0) + 1;
      }
    });

    // 生成推荐
    const recommendations = [];
    allMovies.forEach(movie => {
      if (!watchedMovies.has(movie.id)) {
        let score = 0;
        let reason = '';

        // 基于类别的推荐
        if (watchedCategories[movie.category]) {
          score += watchedCategories[movie.category] * 10;
          reason = `基于您观看的${movie.category}电影`;
        }

        // 基于评分的推荐
        if (movie.rating && movie.rating >= 8) {
          score += 5;
          reason += reason ? '，且评分很高' : '评分很高';
        }

        if (score > 0) {
          recommendations.push({
            movieId: movie.id,
            movieTitle: movie.title,
            moviePoster: movie.poster,
            movieCategory: movie.category,
            movieType: movie.type,
            reason,
            score
          });
        }
      }
    });

    // 按分数排序并保存
    recommendations.sort((a, b) => b.score - a.score);
    recommendations.slice(0, 20).forEach(rec => {
      const recommendation = new Recommendation({
        userId,
        ...rec
      });
      recommendation.save();
    });

    return recommendations.slice(0, 20);
  }
}

module.exports = Recommendation;

