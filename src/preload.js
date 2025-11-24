const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    selectFile: () => ipcRenderer.invoke('dialog:openFile'),
    selectSaveFile: () => ipcRenderer.invoke('dialog:saveFile'),
    detectDuration: (inputPath) => ipcRenderer.invoke('detect-duration', inputPath),
    detectSvgInfo: (inputPath) => ipcRenderer.invoke('detect-svg-info', inputPath),
    startConversion: (config) => ipcRenderer.send('start-conversion', config),
    onProgress: (callback) => ipcRenderer.on('conversion-progress', (_event, value) => callback(value)),
    onComplete: (callback) => ipcRenderer.on('conversion-complete', (_event, value) => callback(value)),
    onError: (callback) => ipcRenderer.on('conversion-error', (_event, value) => callback(value)),
    showItem: (path) => ipcRenderer.send('show-item', path),
    platform: process.platform
});

