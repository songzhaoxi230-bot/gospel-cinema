const express = require('express');
const router = express.Router();
const shareController = require('../controllers/shareController');
const auth = require('../middleware/auth');

// 分享电影（需要认证）
router.post('/movie', auth, shareController.shareMovie);

// 分享收藏夹（需要认证）
router.post('/playlist', auth, shareController.sharePlaylist);

// 分享用户资料（需要认证）
router.post('/profile', auth, shareController.shareProfile);

// 获取分享记录（需要认证）
router.get('/', auth, shareController.getShares);

// 获取分享统计（需要认证）
router.get('/stats', auth, shareController.getShareStats);

// 生成分享二维码（需要认证）
router.post('/qr', auth, shareController.generateShareQR);

// 获取分享链接预览（不需要认证）
router.get('/preview', shareController.getSharePreview);

module.exports = router;

