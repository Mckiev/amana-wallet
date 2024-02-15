import { app, BrowserWindow } from 'electron';
import path from 'node:path';

app.commandLine.appendSwitch('no-experimental-fetch');

const initialize = () => {
  const createWindow = () => {
    const mainWindow = new BrowserWindow({
      width: 1200,
      height: 1000,
      webPreferences: {
        preload: path.join(__dirname, 'renderer/preload.js'),
        nodeIntegration: true,
        contextIsolation: false,
      },
    });
    mainWindow.loadFile(path.join(__dirname, 'renderer/index.html'))
    // mainWindow.webContents.openDevTools()
  };

  app.whenReady().then(() => {
    createWindow()
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
    });
  });
  
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  });
}

export default {
  initialize,
};
