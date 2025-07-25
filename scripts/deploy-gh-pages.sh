#!/bin/bash

# GitHub Pages 部署脚本
# Deploy script for GitHub Pages

set -e  # 遇到错误立即退出

echo "🚀 开始部署到 GitHub Pages..."
echo "🚀 Starting deployment to GitHub Pages..."

# 检查是否有未提交的更改
if [ -n "$(git status --porcelain)" ]; then
    echo "❌ 错误: 有未提交的更改，请先提交或暂存所有更改"
    echo "❌ Error: You have uncommitted changes. Please commit or stash them first."
    exit 1
fi

# 构建项目
echo "📦 构建项目..."
echo "📦 Building project..."
npm run build

# 检查构建是否成功
if [ ! -d "out" ]; then
    echo "❌ 错误: 构建失败，未找到 out 目录"
    echo "❌ Error: Build failed, 'out' directory not found"
    exit 1
fi

# 进入构建输出目录
cd out

# 创建 .nojekyll 文件 (告诉 GitHub Pages 不要使用 Jekyll)
echo "📝 创建 .nojekyll 文件..."
echo "📝 Creating .nojekyll file..."
touch .nojekyll

# 创建 CNAME 文件 (如果需要自定义域名，可以取消注释下面的行)
# echo "yourdomain.com" > CNAME

# 初始化 git 仓库
echo "🔧 初始化部署仓库..."
echo "🔧 Initializing deployment repository..."
git init
git add -A
git commit -m "Deploy to GitHub Pages"

# 强制推送到 gh-pages 分支
echo "🚀 推送到 gh-pages 分支..."
echo "🚀 Pushing to gh-pages branch..."
git branch -M gh-pages
git remote add origin git@github.com:niuyp/DrivingKnowledgeTest.git
git push -f origin gh-pages

# 返回项目根目录
cd ..

# 清理构建文件
echo "🧹 清理构建文件..."
echo "🧹 Cleaning up build files..."
rm -rf out

echo "✅ 部署完成!"
echo "✅ Deployment completed!"
echo "🌐 网站将在几分钟内在以下地址可用:"
echo "🌐 Your site will be available at:"
echo "   https://niuyp.github.io/DrivingKnowledgeTest/" 