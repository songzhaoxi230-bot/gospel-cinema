const { v4: uuidv4 } = require('uuid');

// 收藏夹数据存储（内存）
let playlists = [];

class Playlist {
  constructor(data) {
    this.id = uuidv4();
    this.userId = data.userId;
    this.name = data.name;
    this.description = data.description || '';
    this.icon = data.icon || '📁';
    this.isPublic = data.isPublic || false;
    this.movies = []; // 存储电影ID
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  // 保存收藏夹
  save() {
    const existingPlaylist = playlists.find(p => p.id === this.id);
    if (existingPlaylist) {
      Object.assign(existingPlaylist, this);
    } else {
      playlists.push(this);
    }
    return this;
  }

  // 添加电影到收藏夹
  addMovie(movieId) {
    if (!this.movies.includes(movieId)) {
      this.movies.push(movieId);
      this.updatedAt = new Date();
      this.save();
      return true;
    }
    return false;
  }

  // 从收藏夹移除电影
  removeMovie(movieId) {
    const index = this.movies.indexOf(movieId);
    if (index > -1) {
      this.movies.splice(index, 1);
      this.updatedAt = new Date();
      this.save();
      return true;
    }
    return false;
  }

  // 检查电影是否在收藏夹中
  hasMovie(movieId) {
    return this.movies.includes(movieId);
  }

  // 获取收藏夹中的电影数量
  getMovieCount() {
    return this.movies.length;
  }

  // 根据用户ID获取所有收藏夹
  static findByUserId(userId) {
    return playlists.filter(p => p.userId === userId);
  }

  // 根据ID获取收藏夹
  static findById(id) {
    return playlists.find(p => p.id === id);
  }

  // 根据ID和用户ID获取收藏夹（权限检查）
  static findByIdAndUserId(id, userId) {
    return playlists.find(p => p.id === id && p.userId === userId);
  }

  // 删除收藏夹
  static delete(id) {
    playlists = playlists.filter(p => p.id !== id);
  }

  // 获取所有收藏夹
  static findAll() {
    return playlists;
  }

  // 检查收藏夹名称是否已存在
  static existsByNameAndUserId(name, userId) {
    return playlists.some(p => p.name === name && p.userId === userId);
  }

  // 获取用户的收藏夹数量
  static countByUserId(userId) {
    return playlists.filter(p => p.userId === userId).length;
  }
}

module.exports = Playlist;

