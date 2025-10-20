# 兆西福音电影院 - 部署指南

## 概述

本文档提供了多种部署方式，您可以根据需求选择最合适的部署平台。

---

## 部署方式对比

| 平台 | 难度 | 成本 | 性能 | 推荐指数 |
|------|------|------|------|---------|
| Vercel | ⭐ | 免费 | 优秀 | ⭐⭐⭐⭐⭐ |
| Netlify | ⭐ | 免费 | 优秀 | ⭐⭐⭐⭐⭐ |
| GitHub Pages | ⭐ | 免费 | 良好 | ⭐⭐⭐⭐ |
| Docker | ⭐⭐⭐ | 低 | 优秀 | ⭐⭐⭐⭐ |
| 自建服务器 | ⭐⭐⭐ | 中等 | 优秀 | ⭐⭐⭐ |

---

## 方式1：Vercel部署（推荐）

### 优点
- 完全免费
- 自动HTTPS
- 全球CDN加速
- 自动部署（Git集成）
- 无需配置

### 部署步骤

1. **访问Vercel官网**
   ```
   https://vercel.com
   ```

2. **登录/注册账户**
   - 使用GitHub、GitLab或邮箱注册

3. **导入项目**
   - 点击"New Project"
   - 选择"Import Git Repository"
   - 连接您的GitHub仓库

4. **配置设置**
   - Framework: Vite
   - Build Command: `pnpm build`
   - Output Directory: `dist`

5. **点击Deploy**
   - 等待部署完成
   - 获得永久域名（如：gospel-cinema.vercel.app）

### 自定义域名
- 在Vercel项目设置中添加自定义域名
- 更新DNS记录指向Vercel

---

## 方式2：Netlify部署

### 优点
- 完全免费
- 自动HTTPS
- 全球CDN加速
- 简单易用

### 部署步骤

1. **访问Netlify官网**
   ```
   https://netlify.com
   ```

2. **登录/注册账户**
   - 使用GitHub、GitLab或邮箱注册

3. **连接Git仓库**
   - 点击"New site from Git"
   - 选择您的代码仓库

4. **配置构建设置**
   - Build command: `pnpm build`
   - Publish directory: `dist`

5. **部署**
   - 点击"Deploy site"
   - 获得永久域名（如：gospel-cinema.netlify.app）

---

## 方式3：GitHub Pages部署

### 优点
- 完全免费
- 与GitHub集成
- 自动部署

### 部署步骤

1. **推送代码到GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/gospel-cinema.git
   git push -u origin main
   ```

2. **启用GitHub Pages**
   - 进入仓库Settings
   - 找到Pages选项
   - 选择"Deploy from a branch"
   - 选择main分支，dist文件夹

3. **自动部署**
   - 工作流已配置（.github/workflows/deploy.yml）
   - 每次推送都会自动构建和部署

4. **访问网站**
   - https://YOUR_USERNAME.github.io/gospel-cinema

---

## 方式4：Docker部署

### 优点
- 可部署到任何服务器
- 完全可控
- 适合企业级部署

### 前置要求
- Docker已安装
- Docker Compose已安装

### 部署步骤

1. **构建Docker镜像**
   ```bash
   docker build -t gospel-cinema:latest .
   ```

2. **运行容器**
   ```bash
   docker run -d -p 3000:3000 --name gospel-cinema gospel-cinema:latest
   ```

3. **使用Docker Compose**
   ```bash
   docker-compose up -d
   ```

4. **访问应用**
   ```
   http://localhost:3000
   ```

### 部署到云服务器

#### AWS EC2
```bash
# 连接到EC2实例
ssh -i your-key.pem ec2-user@your-instance-ip

# 安装Docker
sudo yum update -y
sudo yum install docker -y
sudo systemctl start docker

# 上传项目并部署
docker-compose up -d
```

#### DigitalOcean
```bash
# 创建Droplet后连接
ssh root@your-droplet-ip

# 安装Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# 部署
docker-compose up -d
```

#### 阿里云/腾讯云
- 参考各平台的Docker部署文档
- 使用相同的docker-compose.yml配置

---

## 方式5：自建服务器部署

### 前置要求
- Linux服务器（Ubuntu 20.04+）
- Node.js 18+
- pnpm包管理器

### 部署步骤

1. **连接到服务器**
   ```bash
   ssh user@your-server-ip
   ```

2. **安装依赖**
   ```bash
   curl -fsSL https://get.pnpm.io/install.sh | sh -
   source ~/.bashrc
   ```

3. **克隆项目**
   ```bash
   git clone https://github.com/YOUR_USERNAME/gospel-cinema.git
   cd gospel-cinema
   ```

4. **安装和构建**
   ```bash
   pnpm install
   pnpm build
   ```

5. **使用PM2管理进程**
   ```bash
   npm install -g pm2
   pm2 start "pnpm preview" --name gospel-cinema
   pm2 startup
   pm2 save
   ```

6. **配置Nginx反向代理**
   ```bash
   sudo apt-get install nginx
   sudo cp nginx.conf /etc/nginx/nginx.conf
   sudo systemctl restart nginx
   ```

7. **配置SSL证书（Let's Encrypt）**
   ```bash
   sudo apt-get install certbot python3-certbot-nginx
   sudo certbot certonly --nginx -d your-domain.com
   ```

---

## 环境变量配置

如果需要API密钥或其他敏感信息，创建`.env.production`文件：

```env
VITE_API_URL=https://api.example.com
VITE_APP_NAME=兆西福音电影院
```

在构建时这些变量会被注入到应用中。

---

## 性能优化

### 已包含的优化
- ✅ Gzip压缩
- ✅ 代码分割
- ✅ 图片优化
- ✅ CSS/JS最小化
- ✅ 缓存策略

### 进一步优化建议
1. 使用CDN加速静态资源
2. 启用HTTP/2
3. 配置浏览器缓存
4. 使用WebP图片格式
5. 实现代码懒加载

---

## 监控和维护

### 推荐工具
- **Vercel Analytics** - 性能监控
- **Sentry** - 错误追踪
- **Google Analytics** - 用户分析
- **Uptime Robot** - 可用性监控

### 定期维护
- 每月检查依赖更新
- 监控网站性能指标
- 定期备份数据
- 更新安全补丁

---

## 故障排除

### 构建失败
```bash
# 清除缓存
rm -rf node_modules pnpm-lock.yaml
pnpm install
pnpm build
```

### 部署后白屏
- 检查浏览器控制台错误
- 确保所有资源路径正确
- 清除浏览器缓存

### 性能问题
- 检查网络请求
- 优化大型依赖
- 启用CDN加速

---

## 支持和反馈

如有问题，请：
1. 检查本文档
2. 查看平台官方文档
3. 提交GitHub Issue
4. 联系技术支持

---

## 许可证

MIT License

---

**祝您部署顺利！** 🚀

