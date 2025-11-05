const express = require('express');
const router = express.Router();
const downloadController = require('../controllers/downloadController');
const auth = require('../middleware/auth');

// 所有路由都需要认证
router.use(auth);

// 添加下载
router.post('/', downloadController.addDownload);

// 获取下载列表
router.get('/', downloadController.getDownloads);

// 获取下载统计
router.get('/stats', downloadController.getDownloadStats);

// 获取单个电影的下载记录
router.get('/movie/:movieId', downloadController.getMovieDownloads);

// 删除单个下载
router.delete('/:downloadId', downloadController.deleteDownload);

// 删除电影的所有下载
router.delete('/movie/:movieId', downloadController.deleteMovieDownloads);

// 清空所有下载
router.delete('/clear/all', downloadController.clearAllDownloads);

module.exports = router;

