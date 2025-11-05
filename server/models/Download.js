const { v4: uuidv4 } = require('uuid');

let downloads = [];

class Download {
  constructor(data) {
    this.id = uuidv4();
    this.userId = data.userId;
    this.movieId = data.movieId;
    this.movieTitle = data.movieTitle;
    this.moviePoster = data.moviePoster;
    this.movieType = data.movieType || 'movie';
    this.downloadedAt = new Date();
    this.status = 'completed'; // completed, downloading, failed
    this.fileSize = data.fileSize || 0;
    this.quality = data.quality || '720p'; // 480p, 720p, 1080p
  }

  save() {
    const existing = downloads.find(d => d.userId === this.userId && d.movieId === this.movieId && d.quality === this.quality);
    if (existing) {
      Object.assign(existing, this);
    } else {
      downloads.push(this);
    }
    return this;
  }

  static findByUserId(userId) {
    return downloads
      .filter(d => d.userId === userId)
      .sort((a, b) => new Date(b.downloadedAt) - new Date(a.downloadedAt));
  }

  static findByUserIdAndMovieId(userId, movieId) {
    return downloads.filter(d => d.userId === userId && d.movieId === movieId);
  }

  static delete(id) {
    downloads = downloads.filter(d => d.id !== id);
  }

  static deleteByUserId(userId) {
    downloads = downloads.filter(d => d.userId !== userId);
  }

  static deleteByUserIdAndMovieId(userId, movieId) {
    downloads = downloads.filter(d => !(d.userId === userId && d.movieId === movieId));
  }

  static getTotalSize(userId) {
    return downloads
      .filter(d => d.userId === userId)
      .reduce((total, d) => total + d.fileSize, 0);
  }
}

module.exports = Download;

