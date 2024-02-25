import { ipcMain } from 'electron';
import { generateMnemonic } from 'bip39';
import { IpcChannel } from '../common/ipcChannels';
import Railgun from './railgun';
import WindowManager from './WindowManager';

const requests = {
  [IpcChannel.Mnemonic]: (): string => {
    const mnemonic = generateMnemonic(128);
    return mnemonic;
  },
  [IpcChannel.RailgunAddress]: async(mnemonic: string): Promise<string> => {
    const wallet = await Railgun.getWallet(mnemonic);
    return wallet.getAddress();
  },
  [IpcChannel.Withdraw]: async(
    mnemonic: string,
    amount: bigint,
    manifoldUser: string,
  ): Promise<void> => {
    await Railgun.withdraw(mnemonic, amount, manifoldUser);
  },
};

const initialize = (): void => {
  Object.entries(requests)
    .forEach(([channelName, channelHandler]) => {
      ipcMain.handle(channelName, async(e, ...parameters) => (
        channelHandler(...parameters)
      ));
    });

  Railgun.events.on('balance', (balance: bigint) => {
    const mainWindow = WindowManager.getMainWindow();
    mainWindow?.webContents.send('Balance', balance);
  });
};

export default {
  initialize,
};
