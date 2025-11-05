const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const auth = require('../middleware/auth');

// 添加评论（需要认证）
router.post('/', auth, commentController.addComment);

// 获取电影评论（不需要认证）
router.get('/movie/:movieId', commentController.getMovieComments);

// 获取电影评分统计（不需要认证）
router.get('/movie/:movieId/stats', commentController.getRatingStats);

// 获取用户评论（需要认证）
router.get('/user', auth, commentController.getUserComments);

// 更新评论（需要认证）
router.put('/:commentId', auth, commentController.updateComment);

// 删除评论（需要认证）
router.delete('/:commentId', auth, commentController.deleteComment);

// 点赞评论（需要认证）
router.post('/:commentId/like', auth, commentController.likeComment);

// 取消点赞（需要认证）
router.delete('/:commentId/like', auth, commentController.unlikeComment);

// 添加回复（需要认证）
router.post('/:commentId/replies', auth, commentController.addReply);

// 删除回复（需要认证）
router.delete('/:commentId/replies/:replyId', auth, commentController.deleteReply);

module.exports = router;

