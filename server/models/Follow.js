const { v4: uuidv4 } = require('uuid');

let follows = [];

class Follow {
  constructor(data) {
    this.id = uuidv4();
    this.followerId = data.followerId;
    this.followingId = data.followingId;
    this.createdAt = new Date();
  }

  save() {
    const existing = follows.find(f => f.followerId === this.followerId && f.followingId === this.followingId);
    if (!existing) {
      follows.push(this);
    }
    return this;
  }

  static isFollowing(followerId, followingId) {
    return follows.some(f => f.followerId === followerId && f.followingId === followingId);
  }

  static getFollowers(userId) {
    return follows
      .filter(f => f.followingId === userId)
      .map(f => f.followerId);
  }

  static getFollowing(userId) {
    return follows
      .filter(f => f.followerId === userId)
      .map(f => f.followingId);
  }

  static getFollowerCount(userId) {
    return follows.filter(f => f.followingId === userId).length;
  }

  static getFollowingCount(userId) {
    return follows.filter(f => f.followerId === userId).length;
  }

  static unfollow(followerId, followingId) {
    follows = follows.filter(f => !(f.followerId === followerId && f.followingId === followingId));
  }

  static deleteByUserId(userId) {
    follows = follows.filter(f => f.followerId !== userId && f.followingId !== userId);
  }
}

module.exports = Follow;

