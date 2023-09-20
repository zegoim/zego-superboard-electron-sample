// Modules to control application life and create native browser window
const { app, crashReporter,BrowserWindow, ipcMain } = require('electron');
const storage = require('electron-localstorage');

app.setPath('crashDumps', process.cwd() + './crash_temp') 
app.commandLine.appendSwitch('ignore-certificate-errors');
// electron 小于等于 13 版本需要配置
app.allowRendererProcessReuse = false
crashReporter.start({
    productName: 'zego-superboard-electron',
    companyName: 'zego.im',
    uploadToServer: false,
    submitURL: 'http://zego.im'
});

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
    storage.removeItem('zegoConfig');
    mainWindow = new BrowserWindow({
        width: 1358,
        height: 720,
        webPreferences: {
            enableRemoteModule: true,
            // electron 小于等于 13 版本需要配置
            nodeIntegrationInWorker:true,
            nodeIntegration: true,// 允许渲染进程使用nodejs
            contextIsolation: false,// 允许渲染进行使用nodejs
        }
    });
    // and load the index.html of the app.
    mainWindow.loadURL(`file://${app.getAppPath()}/sample/superboard/index.html`);

    // Open the DevTools.
    // mainWindow.webContents.openDevTools();

    // Emitted when the window is closed.
    mainWindow.on('closed', function() {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function() {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function() {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow();
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
