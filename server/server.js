require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const favoriteRoutes = require('./routes/favorites');
const playlistRoutes = require('./routes/playlists');
const watchHistoryRoutes = require('./routes/watchHistory');
const downloadRoutes = require('./routes/downloads');
const commentRoutes = require('./routes/comments');
const followRoutes = require('./routes/follows');
const recommendationRoutes = require('./routes/recommendations');
const shareRoutes = require('./routes/shares');

const app = express();
const PORT = process.env.PORT || 5000;

// 中间件
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: '服务器运行正常' });
});

// API路由
app.use('/api/auth', authRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/playlists', playlistRoutes);
app.use('/api/watch-history', watchHistoryRoutes);
app.use('/api/downloads', downloadRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/follows', followRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/shares', shareRoutes);

// 404处理
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: '请求的资源不存在'
  });
});

// 错误处理
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    success: false,
    message: '服务器内部错误',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║   兆西福音电影院 API 服务器已启动      ║
║   服务器地址: http://localhost:${PORT}  ║
║   前端地址: ${process.env.FRONTEND_URL || 'http://localhost:5173'}       ║
╚════════════════════════════════════════╝
  `);
});

module.exports = app;

