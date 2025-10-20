# 构建阶段
FROM node:18-alpine as builder

WORKDIR /app

# 安装pnpm
RUN npm install -g pnpm

# 复制package文件
COPY package.json pnpm-lock.yaml ./

# 安装依赖
RUN pnpm install --frozen-lockfile

# 复制源代码
COPY . .

# 构建项目
RUN pnpm build

# 生产阶段
FROM node:18-alpine

WORKDIR /app

# 安装serve用于提供静态文件
RUN npm install -g serve

# 从构建阶段复制dist文件夹
COPY --from=builder /app/dist ./dist

# 暴露端口
EXPOSE 3000

# 启动命令
CMD ["serve", "-s", "dist", "-l", "3000"]

