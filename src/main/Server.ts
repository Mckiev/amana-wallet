import { ipcMain } from 'electron';
import { generateMnemonic } from 'bip39';

const initialize = () => {
  ipcMain.handle('mnemonic', () => {
    const mnemonic = generateMnemonic(128);
    return mnemonic;
  });
};

export default {
  initialize,
};
