const express = require('express');
const router = express.Router();
const playlistController = require('../controllers/playlistController');
const { authenticateToken } = require('../middleware/auth');

// 所有收藏夹路由都需要认证
router.use(authenticateToken);

// 创建收藏夹
router.post('/', playlistController.createPlaylist);

// 获取用户的所有收藏夹
router.get('/', playlistController.getUserPlaylists);

// 获取单个收藏夹详情
router.get('/:playlistId', playlistController.getPlaylistDetail);

// 更新收藏夹
router.put('/:playlistId', playlistController.updatePlaylist);

// 删除收藏夹
router.delete('/:playlistId', playlistController.deletePlaylist);

// 添加电影到收藏夹
router.post('/:playlistId/movies', playlistController.addMovieToPlaylist);

// 从收藏夹移除电影
router.delete('/:playlistId/movies/:movieId', playlistController.removeMovieFromPlaylist);

// 检查电影是否在收藏夹中
router.get('/:playlistId/movies/:movieId/check', playlistController.checkMovieInPlaylist);

// 清空收藏夹
router.post('/:playlistId/clear', playlistController.clearPlaylist);

module.exports = router;

