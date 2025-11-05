const User = require('../models/User');
const VerificationCode = require('../models/VerificationCode');
const { generateToken } = require('../middleware/auth');
const axios = require('axios');

// 发送验证码
exports.sendVerificationCode = (req, res) => {
  try {
    const { phone } = req.body;

    // 验证手机号格式
    if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
      return res.status(400).json({
        success: false,
        message: '请输入有效的手机号'
      });
    }

    // 生成验证码
    const code = VerificationCode.generate(phone);

    res.json({
      success: true,
      message: '验证码已发送',
      code: code, // 演示模式下返回验证码
      expiresIn: 600 // 10分钟
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '发送验证码失败',
      error: error.message
    });
  }
};

// 手机验证码登录
exports.loginWithPhone = async (req, res) => {
  try {
    const { phone, code } = req.body;

    // 验证参数
    if (!phone || !code) {
      return res.status(400).json({
        success: false,
        message: '手机号和验证码不能为空'
      });
    }

    // 验证验证码
    const verification = VerificationCode.verify(phone, code);
    if (!verification.success) {
      return res.status(400).json({
        success: false,
        message: verification.message
      });
    }

    // 查找或创建用户
    let user = User.findByPhone(phone);
    if (!user) {
      user = new User({
        phone,
        loginType: 'phone',
        isVerified: true
      });
      user.save();
    }

    // 生成令牌
    const token = generateToken(user.id);

    res.json({
      success: true,
      message: '登录成功',
      token,
      user: user.toJSON()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '登录失败',
      error: error.message
    });
  }
};

// 邮箱密码注册
exports.registerWithEmail = async (req, res) => {
  try {
    const { email, password, confirmPassword, nickname } = req.body;

    // 验证参数
    if (!email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: '邮箱、密码和确认密码不能为空'
      });
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: '请输入有效的邮箱地址'
      });
    }

    // 验证密码长度
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: '密码长度至少为6个字符'
      });
    }

    // 验证密码匹配
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: '两次输入的密码不一致'
      });
    }

    // 检查邮箱是否已注册
    if (User.findByEmail(email)) {
      return res.status(400).json({
        success: false,
        message: '该邮箱已被注册'
      });
    }

    // 创建新用户
    const hashedPassword = await User.hashPassword(password);
    const user = new User({
      email,
      password: hashedPassword,
      nickname: nickname || '用户',
      loginType: 'email',
      isVerified: true
    });
    user.save();

    // 生成令牌
    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      message: '注册成功',
      token,
      user: user.toJSON()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '注册失败',
      error: error.message
    });
  }
};

// 邮箱密码登录
exports.loginWithEmail = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 验证参数
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: '邮箱和密码不能为空'
      });
    }

    // 查找用户
    const user = User.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: '邮箱或密码错误'
      });
    }

    // 验证密码
    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: '邮箱或密码错误'
      });
    }

    // 生成令牌
    const token = generateToken(user.id);

    res.json({
      success: true,
      message: '登录成功',
      token,
      user: user.toJSON()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '登录失败',
      error: error.message
    });
  }
};

// QQ登录初始化
exports.initQQLogin = (req, res) => {
  try {
    const qqAppId = process.env.QQ_APP_ID || 'your_qq_app_id';
    const redirectUri = process.env.QQ_REDIRECT_URI || 'http://localhost:5000/api/auth/qq/callback';
    const state = Math.random().toString(36).substring(7);

    // 保存state用于验证
    if (!global.qqStates) {
      global.qqStates = {};
    }
    global.qqStates[state] = Date.now();

    const qqLoginUrl = `https://graph.qq.com/oauth2.0/authorize?response_type=code&client_id=${qqAppId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=get_user_info&state=${state}`;

    res.json({
      success: true,
      loginUrl: qqLoginUrl,
      message: '请访问上述URL进行QQ登录'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '初始化QQ登录失败',
      error: error.message
    });
  }
};

// QQ登录回调
exports.qqCallback = async (req, res) => {
  try {
    const { code, state } = req.query;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: '未收到授权码'
      });
    }

    // 验证state
    if (!global.qqStates || !global.qqStates[state]) {
      return res.status(400).json({
        success: false,
        message: 'state验证失败'
      });
    }
    delete global.qqStates[state];

    // 这里应该使用真实的QQ API进行令牌交换
    // 为了演示，我们使用模拟数据
    const qqId = 'qq_' + Math.random().toString(36).substr(2, 9);
    const qqNickname = 'QQ用户';
    const qqAvatar = 'https://via.placeholder.com/150';

    // 查找或创建用户
    let user = User.findByQQId(qqId);
    if (!user) {
      user = new User({
        qqId,
        qqNickname,
        qqAvatar,
        nickname: qqNickname,
        avatar: qqAvatar,
        loginType: 'qq',
        isVerified: true
      });
      user.save();
    }

    // 生成令牌
    const token = generateToken(user.id);

    // 重定向到前端，带上令牌
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    res.redirect(`${frontendUrl}?token=${token}&user=${encodeURIComponent(JSON.stringify(user.toJSON()))}`);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'QQ登录失败',
      error: error.message
    });
  }
};

// 获取当前用户信息
exports.getCurrentUser = (req, res) => {
  try {
    const user = User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }

    res.json({
      success: true,
      user: user.toJSON()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取用户信息失败',
      error: error.message
    });
  }
};

// 修改密码
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    const user = User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }

    // 验证旧密码
    if (user.password) {
      const isPasswordValid = await user.validatePassword(oldPassword);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: '原密码错误'
        });
      }
    }

    // 验证新密码
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: '两次输入的新密码不一致'
      });
    }

    // 更新密码
    user.password = await User.hashPassword(newPassword);
    user.save();

    res.json({
      success: true,
      message: '密码修改成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '修改密码失败',
      error: error.message
    });
  }
};

