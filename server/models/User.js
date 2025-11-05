const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

// 内存数据库（演示用）
let users = [];

class User {
  constructor(data) {
    this.id = uuidv4();
    this.phone = data.phone || null;
    this.email = data.email || null;
    this.password = data.password || null;
    this.nickname = data.nickname || '用户' + Math.random().toString(36).substr(2, 9);
    this.avatar = data.avatar || 'https://via.placeholder.com/150';
    this.loginType = data.loginType || 'phone'; // phone, email, qq
    this.qqId = data.qqId || null;
    this.qqNickname = data.qqNickname || null;
    this.qqAvatar = data.qqAvatar || null;
    this.isVerified = data.isVerified || false;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  // 密码加密
  static async hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  // 密码验证
  async validatePassword(password) {
    return bcrypt.compare(password, this.password);
  }

  // 保存用户
  save() {
    const existingUser = users.find(u => u.id === this.id);
    if (existingUser) {
      Object.assign(existingUser, this);
    } else {
      users.push(this);
    }
    return this;
  }

  // 根据ID查找用户
  static findById(id) {
    return users.find(u => u.id === id);
  }

  // 根据手机号查找用户
  static findByPhone(phone) {
    return users.find(u => u.phone === phone);
  }

  // 根据邮箱查找用户
  static findByEmail(email) {
    return users.find(u => u.email === email);
  }

  // 根据QQ ID查找用户
  static findByQQId(qqId) {
    return users.find(u => u.qqId === qqId);
  }

  // 获取所有用户
  static findAll() {
    return users;
  }

  // 删除用户
  static delete(id) {
    users = users.filter(u => u.id !== id);
  }

  // 返回公开信息
  toJSON() {
    const { password, ...user } = this;
    return user;
  }
}

module.exports = User;

