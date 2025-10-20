#!/bin/bash

# 兆西福音电影院 - 快速部署脚本

set -e

echo "=========================================="
echo "  兆西福音电影院 - 快速部署脚本"
echo "=========================================="
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 检查依赖
echo -e "${BLUE}[1/5]${NC} 检查依赖..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}✗ Node.js未安装${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node.js已安装${NC}"

if ! command -v pnpm &> /dev/null; then
    echo -e "${YELLOW}⚠ pnpm未安装，正在安装...${NC}"
    npm install -g pnpm
fi
echo -e "${GREEN}✓ pnpm已安装${NC}"

# 安装依赖
echo ""
echo -e "${BLUE}[2/5]${NC} 安装项目依赖..."
pnpm install
echo -e "${GREEN}✓ 依赖安装完成${NC}"

# 构建项目
echo ""
echo -e "${BLUE}[3/5]${NC} 构建项目..."
pnpm build
echo -e "${GREEN}✓ 项目构建完成${NC}"

# 显示部署选项
echo ""
echo -e "${BLUE}[4/5]${NC} 选择部署方式..."
echo ""
echo "可用的部署选项："
echo "1) Vercel (推荐) - 完全免费，自动HTTPS"
echo "2) Netlify - 完全免费，全球CDN"
echo "3) GitHub Pages - 完全免费，与GitHub集成"
echo "4) Docker - 自建服务器部署"
echo "5) 本地预览 - 仅用于测试"
echo ""
read -p "请选择部署方式 (1-5): " choice

case $choice in
    1)
        echo ""
        echo -e "${BLUE}Vercel部署${NC}"
        echo "请访问: https://vercel.com"
        echo "步骤:"
        echo "1. 登录Vercel账户"
        echo "2. 点击'New Project'"
        echo "3. 导入此GitHub仓库"
        echo "4. 点击'Deploy'"
        echo ""
        echo -e "${GREEN}✓ 部署配置已准备${NC}"
        echo "配置文件: vercel.json"
        ;;
    2)
        echo ""
        echo -e "${BLUE}Netlify部署${NC}"
        if command -v netlify &> /dev/null; then
            echo "正在启动Netlify CLI..."
            netlify deploy
        else
            echo "请安装Netlify CLI: npm install -g netlify-cli"
            echo "然后运行: netlify deploy"
        fi
        ;;
    3)
        echo ""
        echo -e "${BLUE}GitHub Pages部署${NC}"
        echo "请按以下步骤操作:"
        echo "1. 推送代码到GitHub"
        echo "2. 进入仓库Settings > Pages"
        echo "3. 选择'Deploy from a branch'"
        echo "4. 选择main分支，dist文件夹"
        echo ""
        echo -e "${GREEN}✓ GitHub Actions工作流已配置${NC}"
        echo "配置文件: .github/workflows/deploy.yml"
        ;;
    4)
        echo ""
        echo -e "${BLUE}Docker部署${NC}"
        echo "构建Docker镜像..."
        docker build -t gospel-cinema:latest .
        echo ""
        echo -e "${GREEN}✓ Docker镜像已构建${NC}"
        echo ""
        echo "运行容器:"
        echo "docker run -d -p 3000:3000 --name gospel-cinema gospel-cinema:latest"
        echo ""
        echo "或使用Docker Compose:"
        echo "docker-compose up -d"
        ;;
    5)
        echo ""
        echo -e "${BLUE}本地预览${NC}"
        echo "启动预览服务器..."
        pnpm preview
        ;;
    *)
        echo -e "${RED}✗ 无效的选择${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${BLUE}[5/5]${NC} 部署准备完成"
echo ""
echo -e "${GREEN}=========================================="
echo "  部署完成！"
echo "=========================================${NC}"
echo ""
echo "更多信息请查看: DEPLOYMENT.md"
echo ""

