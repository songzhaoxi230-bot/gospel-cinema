const express = require('express');
const router = express.Router();
const recommendationController = require('../controllers/recommendationController');
const auth = require('../middleware/auth');

// 获取推荐电影（需要认证）
router.get('/', auth, recommendationController.getRecommendations);

// 生成推荐（需要认证）
router.post('/generate', auth, recommendationController.generateRecommendations);

// 获取基于类别的推荐（不需要认证）
router.get('/category/:category', recommendationController.getRecommendationsByCategory);

// 获取热门推荐（不需要认证）
router.get('/popular', recommendationController.getPopularRecommendations);

// 获取新上映推荐（不需要认证）
router.get('/new', recommendationController.getNewRecommendations);

// 获取相似电影推荐（不需要认证）
router.get('/similar/:movieId', recommendationController.getSimilarMovies);

// 删除推荐（需要认证）
router.delete('/:recommendationId', auth, recommendationController.deleteRecommendation);

module.exports = router;

