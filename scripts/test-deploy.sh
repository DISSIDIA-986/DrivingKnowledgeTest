#!/bin/bash

# 测试部署脚本 - 不实际推送到 GitHub
# Test deployment script - without actual GitHub push

set -e

echo "🧪 测试部署脚本..."
echo "🧪 Testing deployment script..."

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

# 创建 .nojekyll 文件
echo "📝 创建 .nojekyll 文件..."
echo "📝 Creating .nojekyll file..."
touch .nojekyll

# 模拟 git 操作但不实际推送
echo "🔧 模拟部署仓库操作..."
echo "🔧 Simulating deployment repository operations..."
git init
git add -A
git commit -m "Deploy to GitHub Pages"
git branch -M gh-pages

echo "📋 部署预览:"
echo "📋 Deployment preview:"
echo "   - 构建目录: $(pwd)"
echo "   - 文件数量: $(find . -type f | wc -l)"
echo "   - 总大小: $(du -sh . | cut -f1)"
echo "   - Git 分支: $(git branch --show-current)"
echo "   - 提交信息: $(git log -1 --pretty=format:'%s')"

# 返回项目根目录
cd ..

# 清理构建文件
echo "🧹 清理构建文件..."
echo "🧹 Cleaning up build files..."
rm -rf out

echo "✅ 部署脚本测试完成!"
echo "✅ Deployment script test completed!"
echo "📝 下一步: 在 GitHub 上创建 DrivingKnowledgeTest 仓库后运行实际部署"
echo "📝 Next step: Create DrivingKnowledgeTest repository on GitHub, then run actual deployment"