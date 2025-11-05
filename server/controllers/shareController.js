const { v4: uuidv4 } = require('uuid');

let shares = [];

// 分享电影
exports.shareMovie = (req, res) => {
  try {
    const { movieId, movieTitle, moviePoster, platform } = req.body;
    const userId = req.user.id;

    if (!movieId || !movieTitle || !platform) {
      return res.status(400).json({
        success: false,
        message: '缺少必要参数'
      });
    }

    const share = {
      id: uuidv4(),
      userId,
      movieId,
      movieTitle,
      moviePoster,
      platform, // weibo, wechat, qq, facebook, twitter
      sharedAt: new Date(),
      shareUrl: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/movie/${movieId}`
    };

    shares.push(share);

    // 生成分享链接
    const shareContent = {
      title: movieTitle,
      description: `推荐您观看：${movieTitle}`,
      image: moviePoster,
      url: share.shareUrl
    };

    res.json({
      success: true,
      message: '分享成功',
      data: {
        share,
        shareContent
      }
    });
  } catch (error) {
    console.error('分享失败:', error);
    res.status(500).json({
      success: false,
      message: '分享失败',
      error: error.message
    });
  }
};

// 分享收藏夹
exports.sharePlaylist = (req, res) => {
  try {
    const { playlistId, playlistName, platform } = req.body;
    const userId = req.user.id;

    if (!playlistId || !playlistName || !platform) {
      return res.status(400).json({
        success: false,
        message: '缺少必要参数'
      });
    }

    const share = {
      id: uuidv4(),
      userId,
      playlistId,
      playlistName,
      platform,
      sharedAt: new Date(),
      shareUrl: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/playlist/${playlistId}`
    };

    shares.push(share);

    const shareContent = {
      title: playlistName,
      description: `查看我的收藏夹：${playlistName}`,
      url: share.shareUrl
    };

    res.json({
      success: true,
      message: '分享成功',
      data: {
        share,
        shareContent
      }
    });
  } catch (error) {
    console.error('分享失败:', error);
    res.status(500).json({
      success: false,
      message: '分享失败',
      error: error.message
    });
  }
};

// 分享用户资料
exports.shareProfile = (req, res) => {
  try {
    const { targetUserId, platform } = req.body;
    const userId = req.user.id;

    if (!targetUserId || !platform) {
      return res.status(400).json({
        success: false,
        message: '缺少必要参数'
      });
    }

    const share = {
      id: uuidv4(),
      userId,
      targetUserId,
      platform,
      sharedAt: new Date(),
      shareUrl: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/user/${targetUserId}`
    };

    shares.push(share);

    const shareContent = {
      title: '查看我的资料',
      description: '来看看我在兆西福音电影院的收藏',
      url: share.shareUrl
    };

    res.json({
      success: true,
      message: '分享成功',
      data: {
        share,
        shareContent
      }
    });
  } catch (error) {
    console.error('分享失败:', error);
    res.status(500).json({
      success: false,
      message: '分享失败',
      error: error.message
    });
  }
};

// 获取分享记录
exports.getShares = (req, res) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;

    const userShares = shares
      .filter(s => s.userId === userId)
      .sort((a, b) => new Date(b.sharedAt) - new Date(a.sharedAt));

    const total = userShares.length;
    const data = userShares.slice(offset, offset + limit);

    res.json({
      success: true,
      message: '获取分享记录成功',
      data,
      total,
      limit,
      offset
    });
  } catch (error) {
    console.error('获取分享记录失败:', error);
    res.status(500).json({
      success: false,
      message: '获取分享记录失败',
      error: error.message
    });
  }
};

// 获取分享统计
exports.getShareStats = (req, res) => {
  try {
    const userId = req.user.id;

    const userShares = shares.filter(s => s.userId === userId);
    const platformStats = {};

    userShares.forEach(share => {
      platformStats[share.platform] = (platformStats[share.platform] || 0) + 1;
    });

    res.json({
      success: true,
      message: '获取分享统计成功',
      data: {
        totalShares: userShares.length,
        platformStats
      }
    });
  } catch (error) {
    console.error('获取分享统计失败:', error);
    res.status(500).json({
      success: false,
      message: '获取分享统计失败',
      error: error.message
    });
  }
};

// 生成分享二维码
exports.generateShareQR = (req, res) => {
  try {
    const { type, id } = req.body;

    let shareUrl = '';
    if (type === 'movie') {
      shareUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/movie/${id}`;
    } else if (type === 'playlist') {
      shareUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/playlist/${id}`;
    } else if (type === 'user') {
      shareUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/user/${id}`;
    }

    // 这里可以集成二维码生成库，如 qrcode
    res.json({
      success: true,
      message: '二维码生成成功',
      data: {
        shareUrl,
        qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(shareUrl)}`
      }
    });
  } catch (error) {
    console.error('生成二维码失败:', error);
    res.status(500).json({
      success: false,
      message: '生成二维码失败',
      error: error.message
    });
  }
};

// 获取分享链接预览
exports.getSharePreview = (req, res) => {
  try {
    const { type, id } = req.query;

    let preview = {};
    if (type === 'movie') {
      preview = {
        title: '电影推荐',
        description: '来看看这部精彩的福音电影',
        image: '/api/placeholder/300/400'
      };
    } else if (type === 'playlist') {
      preview = {
        title: '我的收藏夹',
        description: '查看我精心收集的电影',
        image: '/api/placeholder/300/300'
      };
    } else if (type === 'user') {
      preview = {
        title: '用户资料',
        description: '来看看我在兆西福音电影院的收藏',
        image: '/api/placeholder/300/300'
      };
    }

    res.json({
      success: true,
      message: '获取分享预览成功',
      data: preview
    });
  } catch (error) {
    console.error('获取分享预览失败:', error);
    res.status(500).json({
      success: false,
      message: '获取分享预览失败',
      error: error.message
    });
  }
};

