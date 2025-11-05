const Comment = require('../models/Comment');

// 添加评论
exports.addComment = (req, res) => {
  try {
    const { movieId, rating, content } = req.body;
    const userId = req.user.id;
    const userName = req.user.name || '匿名用户';
    const userAvatar = req.user.avatar || 'https://via.placeholder.com/40';

    if (!movieId || !content) {
      return res.status(400).json({
        success: false,
        message: '缺少必要参数'
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: '评分必须在1-5之间'
      });
    }

    const comment = new Comment({
      userId,
      userName,
      userAvatar,
      movieId,
      rating,
      content
    });

    comment.save();

    res.json({
      success: true,
      message: '评论已发布',
      data: comment
    });
  } catch (error) {
    console.error('添加评论失败:', error);
    res.status(500).json({
      success: false,
      message: '添加评论失败',
      error: error.message
    });
  }
};

// 获取电影评论
exports.getMovieComments = (req, res) => {
  try {
    const { movieId } = req.params;
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;
    const sort = req.query.sort || 'latest'; // latest, helpful, rating

    let comments = Comment.findByMovieId(movieId);

    // 排序
    if (sort === 'helpful') {
      comments.sort((a, b) => b.likes - a.likes);
    } else if (sort === 'rating') {
      comments.sort((a, b) => b.rating - a.rating);
    }

    const total = comments.length;
    const data = comments.slice(offset, offset + limit);

    res.json({
      success: true,
      message: '获取评论成功',
      data,
      total,
      limit,
      offset
    });
  } catch (error) {
    console.error('获取评论失败:', error);
    res.status(500).json({
      success: false,
      message: '获取评论失败',
      error: error.message
    });
  }
};

// 获取用户评论
exports.getUserComments = (req, res) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;

    const comments = Comment.findByUserId(userId);
    const total = comments.length;
    const data = comments.slice(offset, offset + limit);

    res.json({
      success: true,
      message: '获取用户评论成功',
      data,
      total,
      limit,
      offset
    });
  } catch (error) {
    console.error('获取用户评论失败:', error);
    res.status(500).json({
      success: false,
      message: '获取用户评论失败',
      error: error.message
    });
  }
};

// 更新评论
exports.updateComment = (req, res) => {
  try {
    const { commentId } = req.params;
    const { rating, content } = req.body;
    const userId = req.user.id;

    const comment = Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: '评论不存在'
      });
    }

    if (comment.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: '无权修改此评论'
      });
    }

    if (rating) comment.rating = rating;
    if (content) comment.content = content;
    comment.updatedAt = new Date();

    comment.save();

    res.json({
      success: true,
      message: '评论已更新',
      data: comment
    });
  } catch (error) {
    console.error('更新评论失败:', error);
    res.status(500).json({
      success: false,
      message: '更新评论失败',
      error: error.message
    });
  }
};

// 删除评论
exports.deleteComment = (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.id;

    const comment = Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: '评论不存在'
      });
    }

    if (comment.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: '无权删除此评论'
      });
    }

    Comment.delete(commentId);

    res.json({
      success: true,
      message: '评论已删除'
    });
  } catch (error) {
    console.error('删除评论失败:', error);
    res.status(500).json({
      success: false,
      message: '删除评论失败',
      error: error.message
    });
  }
};

// 点赞评论
exports.likeComment = (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.id;

    const comment = Comment.likeComment(commentId, userId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: '评论不存在'
      });
    }

    res.json({
      success: true,
      message: '点赞成功',
      data: comment
    });
  } catch (error) {
    console.error('点赞失败:', error);
    res.status(500).json({
      success: false,
      message: '点赞失败',
      error: error.message
    });
  }
};

// 取消点赞
exports.unlikeComment = (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.id;

    const comment = Comment.unlikeComment(commentId, userId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: '评论不存在'
      });
    }

    res.json({
      success: true,
      message: '取消点赞成功',
      data: comment
    });
  } catch (error) {
    console.error('取消点赞失败:', error);
    res.status(500).json({
      success: false,
      message: '取消点赞失败',
      error: error.message
    });
  }
};

// 添加回复
exports.addReply = (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;
    const userName = req.user.name || '匿名用户';
    const userAvatar = req.user.avatar || 'https://via.placeholder.com/40';

    if (!content) {
      return res.status(400).json({
        success: false,
        message: '回复内容不能为空'
      });
    }

    const reply = Comment.addReply(commentId, {
      userId,
      userName,
      userAvatar,
      content
    });

    if (!reply) {
      return res.status(404).json({
        success: false,
        message: '评论不存在'
      });
    }

    res.json({
      success: true,
      message: '回复已发布',
      data: reply
    });
  } catch (error) {
    console.error('添加回复失败:', error);
    res.status(500).json({
      success: false,
      message: '添加回复失败',
      error: error.message
    });
  }
};

// 删除回复
exports.deleteReply = (req, res) => {
  try {
    const { commentId, replyId } = req.params;
    const userId = req.user.id;

    const comment = Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: '评论不存在'
      });
    }

    const reply = comment.replies.find(r => r.id === replyId);
    if (!reply) {
      return res.status(404).json({
        success: false,
        message: '回复不存在'
      });
    }

    if (reply.userId !== userId && comment.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: '无权删除此回复'
      });
    }

    Comment.deleteReply(commentId, replyId);

    res.json({
      success: true,
      message: '回复已删除'
    });
  } catch (error) {
    console.error('删除回复失败:', error);
    res.status(500).json({
      success: false,
      message: '删除回复失败',
      error: error.message
    });
  }
};

// 获取电影评分统计
exports.getRatingStats = (req, res) => {
  try {
    const { movieId } = req.params;

    const averageRating = Comment.getAverageRating(movieId);
    const distribution = Comment.getRatingDistribution(movieId);
    const totalComments = Object.values(distribution).reduce((a, b) => a + b, 0);

    res.json({
      success: true,
      message: '获取评分统计成功',
      data: {
        averageRating,
        totalComments,
        distribution
      }
    });
  } catch (error) {
    console.error('获取评分统计失败:', error);
    res.status(500).json({
      success: false,
      message: '获取评分统计失败',
      error: error.message
    });
  }
};

