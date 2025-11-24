#!/bin/bash

# SVG to GIF Converter - Quick Publish Script
# SVG to GIF 转换器 - 快速发布脚本

echo "🎨 SVG to GIF Converter - Publish to GitHub"
echo "============================================"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ Git is not installed. Please install Git first.${NC}"
    echo -e "${BLUE}   Download from: https://git-scm.com/${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Git is installed${NC}"
echo ""

# Check if already a git repository
if [ -d ".git" ]; then
    echo -e "${YELLOW}⚠️  This is already a Git repository${NC}"
    echo -e "${BLUE}   Checking status...${NC}"
    git status
    echo ""
    read -p "Do you want to add all changes and commit? (y/N) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git add .
        read -p "Enter commit message: " commit_msg
        git commit -m "$commit_msg"
        echo -e "${GREEN}✅ Changes committed${NC}"
    fi
else
    # Initialize new repository
    echo -e "${BLUE}📦 Initializing Git repository...${NC}"
    git init
    
    echo -e "${BLUE}📝 Adding files...${NC}"
    git add .
    
    echo -e "${BLUE}💾 Creating initial commit...${NC}"
    git commit -m "Initial commit - v1.3.0

✨ Features:
- Smart size detection (4 presets)
- Auto compression
- Duration detection  
- Bilingual UI (Chinese/English)
- GitHub Dark theme

🚀 Performance:
- 90% faster startup
- Intelligent dependency management

📚 Complete bilingual documentation"

    echo -e "${GREEN}✅ Repository initialized${NC}"
fi

echo ""
echo "============================================"
echo -e "${GREEN}✅ Your project is ready to publish!${NC}"
echo "============================================"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo ""
echo -e "1. ${BLUE}Create a repository on GitHub:${NC}"
echo -e "   https://github.com/new"
echo ""
echo -e "2. ${BLUE}Repository name:${NC} svg-to-gif-converter"
echo ""
echo -e "3. ${BLUE}Run these commands:${NC}"
echo ""
echo -e "   ${GREEN}git remote add origin https://github.com/YOUR_USERNAME/svg-to-gif-converter.git${NC}"
echo -e "   ${GREEN}git branch -M main${NC}"
echo -e "   ${GREEN}git push -u origin main${NC}"
echo ""
echo -e "${YELLOW}Or use GitHub Desktop for easier publishing!${NC}"
echo -e "${BLUE}Download: https://desktop.github.com/${NC}"
echo ""

