const Download = require('../models/Download');

// 添加下载
exports.addDownload = (req, res) => {
  try {
    const { movieId, movieTitle, moviePoster, movieType, fileSize, quality } = req.body;
    const userId = req.user.id;

    if (!movieId || !movieTitle) {
      return res.status(400).json({
        success: false,
        message: '缺少必要参数'
      });
    }

    const download = new Download({
      userId,
      movieId,
      movieTitle,
      moviePoster,
      movieType,
      fileSize,
      quality
    });

    download.save();

    res.json({
      success: true,
      message: '下载记录已添加',
      data: download
    });
  } catch (error) {
    console.error('添加下载失败:', error);
    res.status(500).json({
      success: false,
      message: '添加下载失败',
      error: error.message
    });
  }
};

// 获取下载列表
exports.getDownloads = (req, res) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;

    const downloads = Download.findByUserId(userId);
    const total = downloads.length;
    const data = downloads.slice(offset, offset + limit);

    res.json({
      success: true,
      message: '获取下载列表成功',
      data,
      total,
      limit,
      offset
    });
  } catch (error) {
    console.error('获取下载列表失败:', error);
    res.status(500).json({
      success: false,
      message: '获取下载列表失败',
      error: error.message
    });
  }
};

// 获取单个电影的下载记录
exports.getMovieDownloads = (req, res) => {
  try {
    const { movieId } = req.params;
    const userId = req.user.id;

    const downloads = Download.findByUserIdAndMovieId(userId, movieId);

    res.json({
      success: true,
      message: '获取电影下载记录成功',
      data: downloads
    });
  } catch (error) {
    console.error('获取电影下载记录失败:', error);
    res.status(500).json({
      success: false,
      message: '获取电影下载记录失败',
      error: error.message
    });
  }
};

// 删除单个下载
exports.deleteDownload = (req, res) => {
  try {
    const { downloadId } = req.params;
    const userId = req.user.id;

    // 验证所有权
    const download = Download.findById?.(downloadId);
    if (!download || download.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: '无权删除此下载'
      });
    }

    Download.delete(downloadId);

    res.json({
      success: true,
      message: '下载已删除'
    });
  } catch (error) {
    console.error('删除下载失败:', error);
    res.status(500).json({
      success: false,
      message: '删除下载失败',
      error: error.message
    });
  }
};

// 删除电影的所有下载
exports.deleteMovieDownloads = (req, res) => {
  try {
    const { movieId } = req.params;
    const userId = req.user.id;

    Download.deleteByUserIdAndMovieId(userId, movieId);

    res.json({
      success: true,
      message: '电影下载已删除'
    });
  } catch (error) {
    console.error('删除电影下载失败:', error);
    res.status(500).json({
      success: false,
      message: '删除电影下载失败',
      error: error.message
    });
  }
};

// 清空所有下载
exports.clearAllDownloads = (req, res) => {
  try {
    const userId = req.user.id;

    Download.deleteByUserId(userId);

    res.json({
      success: true,
      message: '所有下载已清空'
    });
  } catch (error) {
    console.error('清空下载失败:', error);
    res.status(500).json({
      success: false,
      message: '清空下载失败',
      error: error.message
    });
  }
};

// 获取下载统计
exports.getDownloadStats = (req, res) => {
  try {
    const userId = req.user.id;

    const downloads = Download.findByUserId(userId);
    const totalSize = Download.getTotalSize(userId);
    const totalCount = downloads.length;
    const qualityDistribution = {
      '480p': downloads.filter(d => d.quality === '480p').length,
      '720p': downloads.filter(d => d.quality === '720p').length,
      '1080p': downloads.filter(d => d.quality === '1080p').length
    };

    res.json({
      success: true,
      message: '获取下载统计成功',
      data: {
        totalCount,
        totalSize,
        qualityDistribution
      }
    });
  } catch (error) {
    console.error('获取下载统计失败:', error);
    res.status(500).json({
      success: false,
      message: '获取下载统计失败',
      error: error.message
    });
  }
};

