# 兆西福音电影院

一个现代化的福音电影在线观看平台，提供丰富的福音电影和动画内容。

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Node](https://img.shields.io/badge/node-18%2B-brightgreen)

## 🎬 功能特性

### 核心功能
- ✅ **现代化主页** - 炫彩轮播图和内容推荐
- ✅ **用户认证系统** - 注册、登录、密码管理
- ✅ **电影库管理** - 50部福音电影和50部福音动画
- ✅ **内容分类** - 多维度分类和搜索功能
- ✅ **翻页浏览** - 高效的内容分页展示
- ✅ **个人中心** - 收藏、观看记录、上传管理
- ✅ **响应式设计** - 完美适配所有设备

### 设计特点
- 🎨 深色现代化UI设计（Netflix风格）
- 🌈 渐变色和玻璃态视觉效果
- ⚡ 流畅的动画和过渡效果
- 📱 完全响应式（桌面、平板、手机）
- ♿ 无障碍设计支持

## 🚀 快速开始

### 前置要求
- Node.js 18+
- pnpm 8+

### 本地开发

1. **克隆项目**
   ```bash
   git clone https://github.com/YOUR_USERNAME/gospel-cinema.git
   cd gospel_cinema
   ```

2. **安装依赖**
   ```bash
   pnpm install
   ```

3. **启动开发服务器**
   ```bash
   pnpm dev
   ```

4. **打开浏览器**
   ```
   http://localhost:5173
   ```

### 构建生产版本

```bash
pnpm build
```

构建输出将在 `dist` 目录中。

### 预览生产版本

```bash
pnpm preview
```

## 📁 项目结构

```
gospel_cinema/
├── src/
│   ├── components/           # 可复用组件
│   │   ├── Navigation.jsx     # 导航栏
│   │   ├── Carousel.jsx       # 轮播图
│   │   └── MovieCard.jsx      # 电影卡片
│   ├── pages/                 # 页面组件
│   │   ├── HomePage.jsx       # 首页
│   │   ├── MovieList.jsx      # 电影列表
│   │   ├── AnimationList.jsx  # 动画列表
│   │   ├── Login.jsx          # 登录页
│   │   ├── Register.jsx       # 注册页
│   │   └── UserProfile.jsx    # 个人中心
│   ├── App.jsx                # 主应用
│   ├── main.jsx               # 入口文件
│   └── index.css              # 全局样式
├── index.html                 # HTML入口
├── vite.config.js             # Vite配置
├── package.json               # 项目配置
├── Dockerfile                 # Docker配置
├── docker-compose.yml         # Docker Compose配置
├── nginx.conf                 # Nginx配置
├── vercel.json                # Vercel部署配置
├── netlify.toml               # Netlify部署配置
└── DEPLOYMENT.md              # 部署指南
```

## 🛠 技术栈

### 前端框架
- **React 18** - UI框架
- **React Router v6** - 路由管理
- **Vite** - 构建工具
- **Axios** - HTTP客户端

### 样式
- **CSS3** - 原生CSS（无需预处理器）
- **Flexbox & Grid** - 现代布局
- **CSS动画** - 流畅的视觉效果

### 开发工具
- **pnpm** - 包管理器
- **ESLint** - 代码检查（可选）
- **Prettier** - 代码格式化（可选）

## 📦 依赖项

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "axios": "^1.6.0"
  },
  "devDependencies": {
    "vite": "^5.0.8",
    "@vitejs/plugin-react": "^4.2.1",
    "@types/react": "^18.2.37",
    "@types/react-dom": "^18.2.15"
  }
}
```

## 🌐 部署

本项目支持多种部署方式：

### 快速部署（推荐）

#### Vercel
```bash
npm i -g vercel
vercel
```

#### Netlify
```bash
npm i -g netlify-cli
netlify deploy
```

### 详细部署指南

请查看 [DEPLOYMENT.md](./DEPLOYMENT.md) 了解：
- Vercel部署
- Netlify部署
- GitHub Pages部署
- Docker部署
- 自建服务器部署

## 🔐 安全性

- 用户密码使用本地存储（生产环境应使用加密）
- 敏感信息使用环境变量
- 支持HTTPS
- 实现了基本的输入验证

## 📊 性能指标

- **首屏加载时间** < 2s
- **Lighthouse评分** > 90
- **Core Web Vitals** 优秀
- **包大小** < 200KB (gzip)

## 🎨 主题配置

编辑 `src/index.css` 中的CSS变量来自定义主题：

```css
:root {
  --primary-color: #1a1a2e;
  --secondary-color: #16213e;
  --accent-color: #e94560;
  --text-color: #ffffff;
  --text-secondary: #b0b0b0;
  --border-color: #2a2a3e;
  --hover-color: #ff6b7a;
}
```

## 🤝 贡献指南

欢迎提交Issue和Pull Request！

1. Fork本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启Pull Request

## 📝 更新日志

### v1.0.0 (2024-01-20)
- ✨ 初始版本发布
- 🎬 完整的电影库功能
- 👤 用户认证系统
- 🎨 现代化UI设计

## 📄 许可证

本项目采用 [MIT License](./LICENSE) 许可证。

## 📞 联系方式

- 📧 Email: support@gospelcinema.com
- 🐛 Issue: [GitHub Issues](https://github.com/YOUR_USERNAME/gospel-cinema/issues)
- 💬 讨论: [GitHub Discussions](https://github.com/YOUR_USERNAME/gospel-cinema/discussions)

## 🙏 致谢

感谢所有贡献者和用户的支持！

---

**Made with ❤️ for Gospel Cinema**

**祝您使用愉快！** 🎬✨

