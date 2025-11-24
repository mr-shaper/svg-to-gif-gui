@echo off
chcp 65001 > nul
title SVG to GIF 一键启动
color 0A

echo ============================================
echo   SVG to GIF 一键启动 (优化版)
echo ============================================
echo.

REM 检查 Node.js 是否安装
where node > nul 2>&1
if %errorlevel% neq 0 (
    echo 错误：未检测到 Node.js
    echo 请先安装 Node.js: https://nodejs.org/
    pause
    exit /b
)

echo 当前 Node 版本:
node -v
echo 当前 npm 版本:
npm -v
echo.

echo 正在检查项目依赖...

REM 检查 node_modules 是否存在
if not exist "node_modules" (
    echo 依赖未安装，正在安装...
    call npm install
    if %errorlevel% neq 0 (
        echo.
        echo 依赖安装失败，请检查网络或 Node.js 安装。
        pause
        exit /b
    )
) else (
    REM 检查 package.json 是否比 node_modules 更新
    for %%A in (package.json) do set "pkg_time=%%~tA"
    for %%A in (node_modules) do set "nm_time=%%~tA"
    
    if "!pkg_time!" gtr "!nm_time!" (
        echo 检测到 package.json 已更新，重新安装依赖...
        call npm install
    ) else (
        echo 依赖已安装且为最新版本，跳过安装。
    )
)

echo.
echo 启动应用程序...
call npm start

pause

