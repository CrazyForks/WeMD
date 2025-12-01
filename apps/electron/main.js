const { app, BrowserWindow, Menu, dialog, ipcMain, nativeImage } = require('electron');
const path = require('path');
const fs = require('fs');

// 判断是否为开发模式
const isDev =
  process.env.NODE_ENV !== 'production' ||
  process.argv.includes('--dev') ||
  process.env.ELECTRON_START_URL;

app.setName('WeMD');
app.setAppUserModelId('com.wemd.app');

let mainWindow;
let currentFilePath = null; // 当前打开的文件路径

function getWindowIcon() {
    const iconPath = path.join(__dirname, 'assets', 'icon.png');
    const img = nativeImage.createFromPath(iconPath);
    return img.isEmpty() ? null : img;
}

function createWindow() {
    const windowIcon = getWindowIcon();
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 1024,
        minHeight: 640,
        title: 'WeMD',
        icon: windowIcon || undefined,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
        },
        titleBarStyle: 'hidden',
        titleBarOverlay: {
            color: '#f5f7f9',
            symbolColor: '#2c2c2c',
            height: 48,
        },
        trafficLightPosition: { x: 14, y: 14 },
    });

    // 开发模式：加载 Vite 开发服务器
    // 生产模式：加载打包后的文件
    const startUrl = process.env.ELECTRON_START_URL
        ? process.env.ELECTRON_START_URL
        : isDev
            ? 'http://localhost:5173'
            : `file://${path.join(__dirname, '../web/dist/index.html')}`;

    mainWindow.loadURL(startUrl);
    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.webContents.insertCSS(`
          body { padding-top: 52px; box-sizing: border-box; }
          #root, #app, .app-root { padding-top: 0; }
        `).catch(() => {});
    });

    // 如果需要调试可手动打开 DevTools： mainWindow.webContents.openDevTools();

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

// 文件操作函数
async function openFile() {
    const result = await dialog.showOpenDialog(mainWindow, {
        properties: ['openFile'],
        filters: [
            { name: 'Markdown', extensions: ['md', 'markdown'] },
            { name: '所有文件', extensions: ['*'] }
        ]
    });

    if (!result.canceled && result.filePaths.length > 0) {
        const filePath = result.filePaths[0];
        try {
            const content = fs.readFileSync(filePath, 'utf-8');
            currentFilePath = filePath;
            updateWindowTitle();
            return { success: true, filePath, content };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    return { success: false, canceled: true };
}

async function saveFile(content) {
    if (currentFilePath) {
        try {
            fs.writeFileSync(currentFilePath, content, 'utf-8');
            return { success: true, filePath: currentFilePath };
        } catch (error) {
            return { success: false, error: error.message };
        }
    } else {
        return await saveFileAs(content);
    }
}

async function saveFileAs(content) {
    const result = await dialog.showSaveDialog(mainWindow, {
        filters: [
            { name: 'Markdown', extensions: ['md'] },
            { name: '所有文件', extensions: ['*'] }
        ],
        defaultPath: '未命名.md'
    });

    if (!result.canceled && result.filePath) {
        try {
            fs.writeFileSync(result.filePath, content, 'utf-8');
            currentFilePath = result.filePath;
            updateWindowTitle();
            return { success: true, filePath: result.filePath };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    return { success: false, canceled: true };
}

function updateWindowTitle() {
    if (currentFilePath) {
        const fileName = path.basename(currentFilePath);
        mainWindow.setTitle(`${fileName} - WeMD`);
    } else {
        mainWindow.setTitle('WeMD');
    }
}

// IPC 处理器
ipcMain.handle('file:open', async () => {
    return await openFile();
});

ipcMain.handle('file:save', async (event, content) => {
    return await saveFile(content);
});

ipcMain.handle('file:saveAs', async (event, content) => {
    return await saveFileAs(content);
});

// 创建应用菜单
function createMenu() {
    const template = [
        {
            label: 'WeMD',
            submenu: [
                { role: 'about', label: '关于 WeMD' },
                { type: 'separator' },
                { role: 'hide', label: '隐藏 WeMD' },
                { role: 'hideOthers', label: '隐藏其他' },
                { role: 'unhide', label: '显示全部' },
                { type: 'separator' },
                { role: 'quit', label: '退出 WeMD' },
            ],
        },
        {
            label: '文件',
            submenu: [
                {
                    label: '打开...',
                    accelerator: 'CmdOrCtrl+O',
                    click: async () => {
                        const result = await openFile();
                        if (result.success) {
                            mainWindow.webContents.send('file:opened', result);
                        }
                    }
                },
                { type: 'separator' },
                {
                    label: '保存',
                    accelerator: 'CmdOrCtrl+S',
                    click: () => {
                        mainWindow.webContents.send('file:save-request');
                    }
                },
                {
                    label: '另存为...',
                    accelerator: 'CmdOrCtrl+Shift+S',
                    click: () => {
                        mainWindow.webContents.send('file:saveAs-request');
                    }
                },
            ],
        },
        {
            label: '编辑',
            submenu: [
                { role: 'undo', label: '撤销' },
                { role: 'redo', label: '重做' },
                { type: 'separator' },
                { role: 'cut', label: '剪切' },
                { role: 'copy', label: '复制' },
                { role: 'paste', label: '粘贴' },
                { role: 'selectAll', label: '全选' },
            ],
        },
        {
            label: '查看',
            submenu: [
                { role: 'reload', label: '重新加载' },
                { role: 'forceReload', label: '强制重新加载' },
                { role: 'toggleDevTools', label: '开发者工具' },
                { type: 'separator' },
                { role: 'resetZoom', label: '实际大小' },
                { role: 'zoomIn', label: '放大' },
                { role: 'zoomOut', label: '缩小' },
                { type: 'separator' },
                { role: 'togglefullscreen', label: '全屏' },
            ],
        },
        {
            label: '窗口',
            submenu: [
                { role: 'minimize', label: '最小化' },
                { role: 'zoom', label: '缩放' },
                { type: 'separator' },
                { role: 'front', label: '前置全部窗口' },
            ],
        },
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}

app.whenReady().then(() => {
    const dockIcon = getWindowIcon();
    if (process.platform === 'darwin' && dockIcon) {
        app.dock.setIcon(dockIcon);
    }
    createWindow();
    createMenu();
    if (mainWindow) {
        mainWindow.maximize();
    }

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
