import path from 'node:path';
import { app, BrowserWindow } from 'electron';

app.commandLine.appendSwitch('no-experimental-fetch');

let mainWindow: BrowserWindow | undefined;

const getMainWindow = (): BrowserWindow | undefined => mainWindow;

const initialize = () => {
  const createWindow = () => {
    mainWindow = new BrowserWindow({
      width: 1200,
      height: 1000,
      webPreferences: {
        // preload: path.join(__dirname, 'renderer/preload.js'),
        nodeIntegration: true,
        contextIsolation: false,
      },
    });
    mainWindow.loadFile(path.join(__dirname, 'renderer/index.html'));
    // mainWindow.webContents.openDevTools()
  };

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
};

export default {
  initialize,
  getMainWindow,
};
