const { v4: uuidv4 } = require('uuid');

// 收藏数据存储（内存）
let favorites = [];

class Favorite {
  constructor(data) {
    this.id = uuidv4();
    this.userId = data.userId;
    this.movieId = data.movieId;
    this.movieTitle = data.movieTitle;
    this.moviePoster = data.moviePoster;
    this.movieRating = data.movieRating;
    this.movieCategory = data.movieCategory;
    this.movieYear = data.movieYear;
    this.movieType = data.movieType; // 'movie' 或 'animation'
    this.createdAt = new Date();
  }

  // 保存收藏
  save() {
    const existingFavorite = favorites.find(f => f.id === this.id);
    if (existingFavorite) {
      Object.assign(existingFavorite, this);
    } else {
      favorites.push(this);
    }
    return this;
  }

  // 根据用户ID获取所有收藏
  static findByUserId(userId) {
    return favorites.filter(f => f.userId === userId);
  }

  // 检查是否已收藏
  static isFavorited(userId, movieId) {
    return favorites.some(f => f.userId === userId && f.movieId === movieId);
  }

  // 根据ID删除收藏
  static delete(id) {
    favorites = favorites.filter(f => f.id !== id);
  }

  // 根据用户ID和电影ID删除收藏
  static deleteByUserAndMovie(userId, movieId) {
    favorites = favorites.filter(f => !(f.userId === userId && f.movieId === movieId));
  }

  // 获取用户的收藏数量
  static countByUserId(userId) {
    return favorites.filter(f => f.userId === userId).length;
  }

  // 获取所有收藏
  static findAll() {
    return favorites;
  }
}

module.exports = Favorite;

