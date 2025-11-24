const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const { convertSvgToGif, detectAnimationDuration, detectSvgInfo, generateRecommendedSizes } = require('./converter');

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 800, // 增加高度以容纳新的控件
        titleBarStyle: 'hiddenInset', // Mac style, looks good on win too mostly
        backgroundColor: '#0d1117',
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true
        }
    });

    win.loadFile('src/ui/index.html');
    // win.webContents.openDevTools(); // Uncomment for debugging
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// IPC Handlers

// 1. Select File
ipcMain.handle('dialog:openFile', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [{ name: 'SVG Images', extensions: ['svg'] }]
    });
    if (canceled) {
        return null;
    } else {
        return filePaths[0];
    }
});

// 2. Select Output Directory (Optional, currently we just save to same dir or let user pick save path)
ipcMain.handle('dialog:saveFile', async () => {
    const { canceled, filePath } = await dialog.showSaveDialog({
        filters: [{ name: 'GIF Image', extensions: ['gif'] }],
        defaultPath: 'output.gif'
    });
    if (canceled) return null;
    return filePath;
});

// 3. Start Conversion
ipcMain.on('start-conversion', async (event, config) => {
    try {
        const result = await convertSvgToGif(config, (progressData) => {
            event.reply('conversion-progress', progressData);
        });
        
        // 检查文件大小，如果超过限制则自动压缩
        const sizeMB = parseFloat(result.sizeMB);
        const maxSizeMB = config.maxSizeMB || 10;
        
        if (sizeMB > maxSizeMB) {
            event.reply('conversion-progress', { 
                status: `文件过大 (${sizeMB}MB)，正在自动优化...`, 
                progress: 85 
            });
            
            const { autoCompressGif } = require('./converter');
            const compressedResult = await autoCompressGif(
                { ...config, result }, 
                maxSizeMB,
                (progressData) => {
                    event.reply('conversion-progress', progressData);
                }
            );
            
            event.reply('conversion-complete', compressedResult);
        } else {
            event.reply('conversion-complete', result);
        }
    } catch (error) {
        event.reply('conversion-error', error.message);
    }
});

// 4. Detect Animation Duration (deprecated, use detect-svg-info)
ipcMain.handle('detect-duration', async (event, inputPath) => {
    try {
        const duration = await detectAnimationDuration(inputPath);
        return duration;
    } catch (error) {
        console.error('检测动画时长失败:', error);
        return 0;
    }
});

// 4.1 Detect SVG Info (size + duration + recommendations)
ipcMain.handle('detect-svg-info', async (event, inputPath) => {
    try {
        const info = await detectSvgInfo(inputPath);
        const recommendations = generateRecommendedSizes(info.width, info.height);
        return {
            ...info,
            recommendations
        };
    } catch (error) {
        console.error('检测 SVG 信息失败:', error);
        return null;
    }
});

// 5. Show Item In Folder
ipcMain.on('show-item', (event, filePath) => {
    shell.showItemInFolder(filePath);
});

