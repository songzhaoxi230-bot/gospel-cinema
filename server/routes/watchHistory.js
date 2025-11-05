const express = require('express');
const router = express.Router();
const watchHistoryController = require('../controllers/watchHistoryController');
const auth = require('../middleware/auth');

// 所有路由都需要认证
router.use(auth);

// 记录观看
router.post('/', watchHistoryController.recordWatch);

// 更新观看进度
router.put('/:movieId', watchHistoryController.updateWatchProgress);

// 获取观看历史
router.get('/', watchHistoryController.getWatchHistory);

// 获取最近观看
router.get('/recent', watchHistoryController.getRecentlyWatched);

// 获取单个电影的观看记录
router.get('/:movieId', watchHistoryController.getWatchRecord);

// 删除单个观看记录
router.delete('/:movieId', watchHistoryController.deleteWatchRecord);

// 清空所有观看历史
router.delete('/clear/all', watchHistoryController.clearWatchHistory);

module.exports = router;

