const { v4: uuidv4 } = require('uuid');

let watchHistories = [];

class WatchHistory {
  constructor(data) {
    this.id = uuidv4();
    this.userId = data.userId;
    this.movieId = data.movieId;
    this.movieTitle = data.movieTitle;
    this.moviePoster = data.moviePoster;
    this.movieType = data.movieType || 'movie';
    this.watchedAt = new Date();
    this.duration = data.duration || 0; // 观看时长（秒）
    this.progress = data.progress || 0; // 观看进度（百分比）
  }

  save() {
    const existing = watchHistories.find(w => w.userId === this.userId && w.movieId === this.movieId);
    if (existing) {
      Object.assign(existing, this);
    } else {
      watchHistories.push(this);
    }
    return this;
  }

  static findByUserId(userId) {
    return watchHistories
      .filter(w => w.userId === userId)
      .sort((a, b) => new Date(b.watchedAt) - new Date(a.watchedAt));
  }

  static findByUserIdAndMovieId(userId, movieId) {
    return watchHistories.find(w => w.userId === userId && w.movieId === movieId);
  }

  static delete(id) {
    watchHistories = watchHistories.filter(w => w.id !== id);
  }

  static deleteByUserId(userId) {
    watchHistories = watchHistories.filter(w => w.userId !== userId);
  }

  static deleteByUserIdAndMovieId(userId, movieId) {
    watchHistories = watchHistories.filter(w => !(w.userId === userId && w.movieId === movieId));
  }
}

module.exports = WatchHistory;

