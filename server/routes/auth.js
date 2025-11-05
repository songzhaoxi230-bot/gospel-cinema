const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

// 发送验证码
router.post('/send-code', authController.sendVerificationCode);

// 手机验证码登录
router.post('/login-phone', authController.loginWithPhone);

// 邮箱密码注册
router.post('/register', authController.registerWithEmail);

// 邮箱密码登录
router.post('/login', authController.loginWithEmail);

// QQ登录初始化
router.get('/qq/init', authController.initQQLogin);

// QQ登录回调
router.get('/qq/callback', authController.qqCallback);

// 获取当前用户（需要认证）
router.get('/me', authenticateToken, authController.getCurrentUser);

// 修改密码（需要认证）
router.post('/change-password', authenticateToken, authController.changePassword);

module.exports = router;

