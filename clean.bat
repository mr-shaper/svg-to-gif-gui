@echo off
chcp 65001 > nul
setlocal

echo ============================================
echo    清理项目依赖和缓存
echo ============================================
echo.
echo 此操作将删除以下内容：
echo   - node_modules\
echo   - package-lock.json
echo.
echo 下次启动时会重新安装所有依赖
echo.
set /p confirm="确定要继续吗？(y/N): "

if /i "%confirm%"=="y" (
    echo.
    echo 正在清理...
    
    if exist "node_modules" (
        echo 删除 node_modules...
        rmdir /s /q node_modules
    )
    
    if exist "package-lock.json" (
        echo 删除 package-lock.json...
        del /f /q package-lock.json
    )
    
    echo.
    echo 清理完成！
    echo 下次运行 start_win.bat 将重新安装依赖。
) else (
    echo.
    echo 已取消清理操作。
)

echo.
pause

