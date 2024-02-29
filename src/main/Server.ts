import { ipcMain } from 'electron';
import { generateMnemonic } from 'bip39';
import { IpcChannel } from '../common/ipcChannels';
import type { TransactionLog } from '../common/types';
import Railgun from './railgun';
import WindowManager from './WindowManager';

const initialize = (): void => {
  ipcMain.handle(IpcChannel.Mnemonic, () => {
    const mnemonic = generateMnemonic(128);
    return mnemonic;
  });

  ipcMain.handle(IpcChannel.RailgunAddress, async(e, mnemonic: string) => {
    const wallet = await Railgun.getWallet(mnemonic);
    return wallet.getAddress();
  });

  ipcMain.handle(
    IpcChannel.Withdraw,
    async(e, mnemonic: string, amount: bigint, manifoldUser: string) => {
      await Railgun.withdraw(mnemonic, amount, manifoldUser);
    }
  );

  ipcMain.handle(
    IpcChannel.Bet,
    async(
      e,
      mnemonic: string,
      amount: bigint,
      marketUrl: string,
      prediction: string,
    ) => {
      await Railgun.bet(mnemonic, amount, marketUrl, prediction);
    }
  );

  Railgun.events.on('balance', (balance: bigint) => {
    const mainWindow = WindowManager.getMainWindow();
    mainWindow?.webContents.send('Balance', balance);
  });

  Railgun.events.on('transactions', (transactions: TransactionLog) => {
    const mainWindow = WindowManager.getMainWindow();
    mainWindow?.webContents.send('Transactions', transactions);
  });
};

export default {
  initialize,
};
