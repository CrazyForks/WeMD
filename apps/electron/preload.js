const { contextBridge, ipcRenderer } = require('electron');

// 暴露安全的 API 给渲染进程
contextBridge.exposeInMainWorld('electron', {
    // 检测是否在 Electron 环境中
    isElectron: true,

    // 平台信息
    platform: process.platform,

    // 文件操作 API
    file: {
        open: () => ipcRenderer.invoke('file:open'),
        save: (content) => ipcRenderer.invoke('file:save', content),
        saveAs: (content) => ipcRenderer.invoke('file:saveAs', content),

        // 监听文件操作事件
        onOpened: (callback) => {
            ipcRenderer.on('file:opened', (event, data) => callback(data));
        },
        onSaveRequest: (callback) => {
            ipcRenderer.on('file:save-request', () => callback());
        },
        onSaveAsRequest: (callback) => {
            ipcRenderer.on('file:saveAs-request', () => callback());
        },

        // 移除监听器
        removeOpenedListener: (callback) => {
            ipcRenderer.removeListener('file:opened', callback);
        },
        removeSaveRequestListener: (callback) => {
            ipcRenderer.removeListener('file:save-request', callback);
        },
        removeSaveAsRequestListener: (callback) => {
            ipcRenderer.removeListener('file:saveAs-request', callback);
        },
    },
});
