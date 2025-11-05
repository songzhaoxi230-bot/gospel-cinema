const express = require('express');
const router = express.Router();
const followController = require('../controllers/followController');
const auth = require('../middleware/auth');

// 关注用户（需要认证）
router.post('/', auth, followController.followUser);

// 取消关注（需要认证）
router.delete('/:followingId', auth, followController.unfollowUser);

// 检查是否关注（需要认证）
router.get('/check/:followingId', auth, followController.checkFollowing);

// 获取我的关注列表（需要认证）
router.get('/following/list', auth, followController.getFollowing);

// 获取我的粉丝列表（需要认证）
router.get('/followers/list', auth, followController.getFollowers);

// 获取关注统计（需要认证）
router.get('/stats', auth, followController.getFollowStats);

// 获取用户的粉丝列表（公开）
router.get('/user/:userId/followers', followController.getUserFollowers);

// 获取用户的关注列表（公开）
router.get('/user/:userId/following', followController.getUserFollowing);

module.exports = router;

