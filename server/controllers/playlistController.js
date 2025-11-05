const Playlist = require('../models/Playlist');
const User = require('../models/User');

// 创建收藏夹
exports.createPlaylist = (req, res) => {
  try {
    const { name, description, icon, isPublic } = req.body;
    const userId = req.user.userId;

    // 验证参数
    if (!name || name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: '收藏夹名称不能为空'
      });
    }

    // 检查名称长度
    if (name.length > 50) {
      return res.status(400).json({
        success: false,
        message: '收藏夹名称不能超过50个字符'
      });
    }

    // 检查用户是否存在
    const user = User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }

    // 检查收藏夹名称是否已存在
    if (Playlist.existsByNameAndUserId(name, userId)) {
      return res.status(400).json({
        success: false,
        message: '该收藏夹名称已存在'
      });
    }

    // 创建收藏夹
    const playlist = new Playlist({
      userId,
      name: name.trim(),
      description: description || '',
      icon: icon || '📁',
      isPublic: isPublic || false
    });

    playlist.save();

    res.status(201).json({
      success: true,
      message: '收藏夹创建成功',
      playlist: playlist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '创建收藏夹失败',
      error: error.message
    });
  }
};

// 获取用户的所有收藏夹
exports.getUserPlaylists = (req, res) => {
  try {
    const userId = req.user.userId;

    // 检查用户是否存在
    const user = User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }

    // 获取收藏夹列表
    const playlists = Playlist.findByUserId(userId);

    res.json({
      success: true,
      message: '获取收藏夹列表成功',
      data: playlists,
      count: playlists.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取收藏夹列表失败',
      error: error.message
    });
  }
};

// 获取单个收藏夹详情
exports.getPlaylistDetail = (req, res) => {
  try {
    const { playlistId } = req.params;
    const userId = req.user.userId;

    if (!playlistId) {
      return res.status(400).json({
        success: false,
        message: '收藏夹ID不能为空'
      });
    }

    const playlist = Playlist.findByIdAndUserId(playlistId, userId);

    if (!playlist) {
      return res.status(404).json({
        success: false,
        message: '收藏夹不存在'
      });
    }

    res.json({
      success: true,
      message: '获取收藏夹详情成功',
      data: playlist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取收藏夹详情失败',
      error: error.message
    });
  }
};

// 更新收藏夹
exports.updatePlaylist = (req, res) => {
  try {
    const { playlistId } = req.params;
    const { name, description, icon, isPublic } = req.body;
    const userId = req.user.userId;

    if (!playlistId) {
      return res.status(400).json({
        success: false,
        message: '收藏夹ID不能为空'
      });
    }

    const playlist = Playlist.findByIdAndUserId(playlistId, userId);

    if (!playlist) {
      return res.status(404).json({
        success: false,
        message: '收藏夹不存在'
      });
    }

    // 更新字段
    if (name && name.trim() !== '') {
      if (name.length > 50) {
        return res.status(400).json({
          success: false,
          message: '收藏夹名称不能超过50个字符'
        });
      }
      playlist.name = name.trim();
    }

    if (description !== undefined) {
      playlist.description = description;
    }

    if (icon) {
      playlist.icon = icon;
    }

    if (isPublic !== undefined) {
      playlist.isPublic = isPublic;
    }

    playlist.updatedAt = new Date();
    playlist.save();

    res.json({
      success: true,
      message: '收藏夹更新成功',
      playlist: playlist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '更新收藏夹失败',
      error: error.message
    });
  }
};

// 删除收藏夹
exports.deletePlaylist = (req, res) => {
  try {
    const { playlistId } = req.params;
    const userId = req.user.userId;

    if (!playlistId) {
      return res.status(400).json({
        success: false,
        message: '收藏夹ID不能为空'
      });
    }

    const playlist = Playlist.findByIdAndUserId(playlistId, userId);

    if (!playlist) {
      return res.status(404).json({
        success: false,
        message: '收藏夹不存在'
      });
    }

    Playlist.delete(playlistId);

    res.json({
      success: true,
      message: '收藏夹删除成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '删除收藏夹失败',
      error: error.message
    });
  }
};

// 添加电影到收藏夹
exports.addMovieToPlaylist = (req, res) => {
  try {
    const { playlistId } = req.params;
    const { movieId, movieTitle, moviePoster, movieRating, movieCategory, movieYear, movieType } = req.body;
    const userId = req.user.userId;

    if (!playlistId || !movieId) {
      return res.status(400).json({
        success: false,
        message: '收藏夹ID和电影ID不能为空'
      });
    }

    const playlist = Playlist.findByIdAndUserId(playlistId, userId);

    if (!playlist) {
      return res.status(404).json({
        success: false,
        message: '收藏夹不存在'
      });
    }

    if (playlist.hasMovie(movieId)) {
      return res.status(400).json({
        success: false,
        message: '该电影已在收藏夹中'
      });
    }

    playlist.addMovie(movieId);

    res.json({
      success: true,
      message: '电影添加成功',
      playlist: playlist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '添加电影失败',
      error: error.message
    });
  }
};

// 从收藏夹移除电影
exports.removeMovieFromPlaylist = (req, res) => {
  try {
    const { playlistId, movieId } = req.params;
    const userId = req.user.userId;

    if (!playlistId || !movieId) {
      return res.status(400).json({
        success: false,
        message: '收藏夹ID和电影ID不能为空'
      });
    }

    const playlist = Playlist.findByIdAndUserId(playlistId, userId);

    if (!playlist) {
      return res.status(404).json({
        success: false,
        message: '收藏夹不存在'
      });
    }

    playlist.removeMovie(movieId);

    res.json({
      success: true,
      message: '电影移除成功',
      playlist: playlist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '移除电影失败',
      error: error.message
    });
  }
};

// 检查电影是否在收藏夹中
exports.checkMovieInPlaylist = (req, res) => {
  try {
    const { playlistId, movieId } = req.params;
    const userId = req.user.userId;

    if (!playlistId || !movieId) {
      return res.status(400).json({
        success: false,
        message: '收藏夹ID和电影ID不能为空'
      });
    }

    const playlist = Playlist.findByIdAndUserId(playlistId, userId);

    if (!playlist) {
      return res.status(404).json({
        success: false,
        message: '收藏夹不存在'
      });
    }

    const hasMovie = playlist.hasMovie(movieId);

    res.json({
      success: true,
      hasMovie: hasMovie
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '检查失败',
      error: error.message
    });
  }
};

// 清空收藏夹
exports.clearPlaylist = (req, res) => {
  try {
    const { playlistId } = req.params;
    const userId = req.user.userId;

    if (!playlistId) {
      return res.status(400).json({
        success: false,
        message: '收藏夹ID不能为空'
      });
    }

    const playlist = Playlist.findByIdAndUserId(playlistId, userId);

    if (!playlist) {
      return res.status(404).json({
        success: false,
        message: '收藏夹不存在'
      });
    }

    const count = playlist.movies.length;
    playlist.movies = [];
    playlist.updatedAt = new Date();
    playlist.save();

    res.json({
      success: true,
      message: `已清空 ${count} 个电影`,
      playlist: playlist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '清空收藏夹失败',
      error: error.message
    });
  }
};

