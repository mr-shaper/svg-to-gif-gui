#!/bin/bash

# 获取脚本所在目录的绝对路径并进入
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"

# 定义颜色
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}============================================${NC}"
echo -e "${YELLOW}   清理项目依赖和缓存    ${NC}"
echo -e "${YELLOW}============================================${NC}"

echo -e "${RED}此操作将删除以下内容：${NC}"
echo "  - node_modules/"
echo "  - package-lock.json"
echo ""
echo -e "${YELLOW}下次启动时会重新安装所有依赖${NC}"
echo ""
read -p "确定要继续吗？(y/N) " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${RED}正在清理...${NC}"
    
    if [ -d "node_modules" ]; then
        echo "删除 node_modules..."
        rm -rf node_modules
    fi
    
    if [ -f "package-lock.json" ]; then
        echo "删除 package-lock.json..."
        rm package-lock.json
    fi
    
    echo -e "${GREEN}清理完成！${NC}"
    echo -e "${GREEN}下次运行 start_mac.command 将重新安装依赖。${NC}"
else
    echo -e "${YELLOW}已取消清理操作。${NC}"
fi

