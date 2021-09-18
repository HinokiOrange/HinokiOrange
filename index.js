const { app, BrowserWindow, ipcMain, dialog, contextBridge } = require("electron");
const path = require("path");
const { default: getPath } = require("platform-folders");
require("electron-reload")(path.join(__dirname, 'public'));

ipcMain.handle("select:dir", async (evt, { path = getPath('documents') } = {}) => {
    return await dialog.showOpenDialog({ properties: ["openDirectory", "promptToCreate"], defaultPath: path });
})

app.on("ready", () => {
    const mainWindow = new BrowserWindow({
        maximizable: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            nativeWindowOpen: true,
        }
    });
    mainWindow.loadFile(path.join(__dirname, "public/index.html"));
    mainWindow.webContents.openDevTools();
});

