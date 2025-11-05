const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');
const { authenticateToken } = require('../middleware/auth');

// 所有收藏路由都需要认证
router.use(authenticateToken);

// 添加收藏
router.post('/', favoriteController.addFavorite);

// 获取用户的所有收藏
router.get('/', favoriteController.getUserFavorites);

// 检查电影是否已收藏
router.get('/check/:movieId', favoriteController.checkFavorite);

// 获取收藏数量
router.get('/count', favoriteController.getFavoriteCount);

// 删除收藏
router.delete('/:movieId', favoriteController.removeFavorite);

// 批量删除收藏
router.post('/batch/remove', favoriteController.removeBatchFavorites);

// 清空所有收藏
router.post('/clear/all', favoriteController.clearAllFavorites);

module.exports = router;

