#!/bin/bash

# 获取脚本所在目录的绝对路径并进入
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"

# 定义颜色
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}   SVG to GIF Converter 转换器          ${NC}"
echo -e "${GREEN}   One-Click Startup / 一键启动         ${NC}"
echo -e "${GREEN}============================================${NC}"

# 1. 尝试添加常用路径
export PATH=$PATH:/usr/local/bin:/opt/homebrew/bin:/opt/local/bin

# 2. 检测 Node.js 是否存在
if ! command -v node &> /dev/null; then
    echo -e "${BLUE}[Info / 提示] Node.js not detected, downloading portable version...${NC}"
    echo -e "${BLUE}           未检测到全局 Node.js，准备下载便携版...${NC}"
    
    # 检测架构 (Intel vs Apple Silicon)
    ARCH=$(uname -m)
    if [ "$ARCH" = "x86_64" ]; then
        NODE_ARCH="x64"
    elif [ "$ARCH" = "arm64" ]; then
        NODE_ARCH="arm64"
    else
        echo -e "${RED}不支持的架构: $ARCH${NC}"
        exit 1
    fi
    
    NODE_VER="v20.10.0"
    NODE_DIST="node-$NODE_VER-darwin-$NODE_ARCH"
    # Revert to official Node.js source since user is in US
    NODE_URL="https://nodejs.org/dist/$NODE_VER/$NODE_DIST.tar.gz"
    LOCAL_NODE_DIR="$DIR/runtime/node"

    # === 新增：自动检测并移动用户手动解压的 Node 文件夹 ===
    # 查找当前目录下是否有类似 node-v20.10.0-darwin-arm64 的文件夹
    MANUAL_NODE_DIR=$(find "$DIR" -maxdepth 1 -type d -name "node-v*-darwin-*" | head -n 1)
    
    if [ ! -z "$MANUAL_NODE_DIR" ]; then
        echo -e "${BLUE}Detected manually extracted Node.js / 检测到您已手动解压 Node.js: $(basename "$MANUAL_NODE_DIR")${NC}"
        echo -e "${BLUE}Configuring directory structure... / 正在自动配置目录结构...${NC}"
        mkdir -p "$DIR/runtime"
        # 如果 runtime/node 已经存在先删除，防止冲突
        rm -rf "$LOCAL_NODE_DIR"
        # 移动并重命名为脚本需要的路径
        mv "$MANUAL_NODE_DIR" "$LOCAL_NODE_DIR"
        echo -e "${GREEN}Setup completed! / 环境配置完成！${NC}"
    fi
    # =================================================

    # 如果还没下载过（且上面也没检测到手动的）
    if [ ! -f "$LOCAL_NODE_DIR/bin/node" ]; then
        echo -e "${BLUE}Downloading Node.js ($NODE_VER - $NODE_ARCH)...${NC}"
        echo -e "${BLUE}下载地址 / URL: $NODE_URL${NC}"
        
        mkdir -p "$DIR/runtime"
        curl -o "$DIR/runtime/node.tar.gz" --progress-bar "$NODE_URL"
        
        if [ $? -ne 0 ]; then
             echo -e "${RED}Download failed / 下载失败${NC}"
             echo -e "${RED}Please check network or install Node.js manually / 请检查网络或手动安装 Node.js${NC}"
             exit 1
        fi

        echo -e "${BLUE}Extracting... / 正在解压...${NC}"
        tar -xzf "$DIR/runtime/node.tar.gz" -C "$DIR/runtime"
        mv "$DIR/runtime/$NODE_DIST" "$LOCAL_NODE_DIR"
        rm "$DIR/runtime/node.tar.gz"
        echo -e "${GREEN}Node.js portable version installed! / Node.js 便携版安装完成！${NC}"
    fi

    # 将本地 Node 加入临时 PATH
    export PATH="$LOCAL_NODE_DIR/bin:$PATH"
fi

# 再次确认
echo -e "Node version / 当前 Node 版本: $(node -v)"
echo -e "npm version / 当前 npm 版本: $(npm -v)"

echo -e "${BLUE}Checking dependencies... / 正在检查项目依赖...${NC}"

# 检查 node_modules 是否存在且完整
if [ ! -d "node_modules" ] || [ ! -f "node_modules/.package-lock.json" ]; then
    echo -e "${BLUE}Installing dependencies... / 依赖未安装，正在安装...${NC}"
    npm install --scripts-prepend-node-path=true
else
    # 检查 package.json 是否比 node_modules 更新
    if [ "package.json" -nt "node_modules/.package-lock.json" ]; then
        echo -e "${BLUE}package.json updated, reinstalling... / 检测到 package.json 已更新，重新安装依赖...${NC}"
        npm install --scripts-prepend-node-path=true
    else
        echo -e "${GREEN}Dependencies up to date, skipping... / 依赖已安装且为最新版本，跳过安装。${NC}"
    fi
fi

echo -e "${GREEN}Starting application... / 启动应用程序...${NC}"
npm start --scripts-prepend-node-path=true
