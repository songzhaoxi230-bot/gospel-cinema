const { v4: uuidv4 } = require('uuid');

let comments = [];

class Comment {
  constructor(data) {
    this.id = uuidv4();
    this.userId = data.userId;
    this.userName = data.userName;
    this.userAvatar = data.userAvatar || 'https://via.placeholder.com/40';
    this.movieId = data.movieId;
    this.rating = data.rating || 5; // 1-5 stars
    this.content = data.content;
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.likes = 0;
    this.likedBy = [];
    this.replies = [];
  }

  save() {
    const existing = comments.find(c => c.id === this.id);
    if (existing) {
      Object.assign(existing, this);
    } else {
      comments.push(this);
    }
    return this;
  }

  static findByMovieId(movieId) {
    return comments
      .filter(c => c.movieId === movieId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  static findById(id) {
    return comments.find(c => c.id === id);
  }

  static findByUserId(userId) {
    return comments
      .filter(c => c.userId === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  static delete(id) {
    comments = comments.filter(c => c.id !== id);
  }

  static getAverageRating(movieId) {
    const movieComments = comments.filter(c => c.movieId === movieId);
    if (movieComments.length === 0) return 0;
    const sum = movieComments.reduce((total, c) => total + c.rating, 0);
    return (sum / movieComments.length).toFixed(1);
  }

  static getRatingDistribution(movieId) {
    const movieComments = comments.filter(c => c.movieId === movieId);
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    movieComments.forEach(c => {
      distribution[c.rating]++;
    });
    return distribution;
  }

  static addReply(commentId, reply) {
    const comment = comments.find(c => c.id === commentId);
    if (comment) {
      const replyObj = {
        id: uuidv4(),
        userId: reply.userId,
        userName: reply.userName,
        userAvatar: reply.userAvatar || 'https://via.placeholder.com/40',
        content: reply.content,
        createdAt: new Date(),
        likes: 0,
        likedBy: []
      };
      comment.replies.push(replyObj);
      return replyObj;
    }
    return null;
  }

  static deleteReply(commentId, replyId) {
    const comment = comments.find(c => c.id === commentId);
    if (comment) {
      comment.replies = comment.replies.filter(r => r.id !== replyId);
      return true;
    }
    return false;
  }

  static likeComment(commentId, userId) {
    const comment = comments.find(c => c.id === commentId);
    if (comment) {
      if (!comment.likedBy.includes(userId)) {
        comment.likedBy.push(userId);
        comment.likes++;
      }
      return comment;
    }
    return null;
  }

  static unlikeComment(commentId, userId) {
    const comment = comments.find(c => c.id === commentId);
    if (comment) {
      const index = comment.likedBy.indexOf(userId);
      if (index > -1) {
        comment.likedBy.splice(index, 1);
        comment.likes--;
      }
      return comment;
    }
    return null;
  }
}

module.exports = Comment;

