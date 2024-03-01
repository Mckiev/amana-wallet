import path from 'node:path';
import { app, screen as electronScreen, BrowserWindow } from 'electron';
import Logger from 'eleventh';

app.commandLine.appendSwitch('no-experimental-fetch');

let mainWindow: BrowserWindow | undefined;

const getMainWindow = (): BrowserWindow | undefined => mainWindow;

const initialize = async(): Promise<void> => {
  const createWindow = async(): Promise<void> => {
    const primaryDisplay = electronScreen.getPrimaryDisplay();
    mainWindow = new BrowserWindow({
      width: Math.round(primaryDisplay.size.width * 0.6),
      height: Math.round(primaryDisplay.size.height * 0.8),
      webPreferences: {
        // preload: path.join(__dirname, 'renderer/preload.js'),
        nodeIntegration: true,
        contextIsolation: false,
      },
    });
    await mainWindow.loadFile(path.join(__dirname, 'renderer/index.html'));
    // mainWindow.webContents.openDevTools()
  };

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  await app.whenReady();
  await createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow().catch((e: unknown) => {
        if (e instanceof Error) {
          Logger.error(e.message);
        } else if (typeof e === 'string') {
          Logger.error(e);
        } else {
          Logger.error('Unknown error');
        }
      });
    }
  });
};

export default {
  initialize,
  getMainWindow,
};
