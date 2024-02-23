import { ipcMain } from 'electron';
import { generateMnemonic } from 'bip39';
import { IpcChannel } from '../common/ipcChannels';
import Railgun from './railgun';
import WindowManager from './WindowManager';

type IpcHandler = (...parameters: any[]) => unknown;
type IpcHandlers = Record<IpcChannel, IpcHandler>;

const requests: IpcHandlers = {
  [IpcChannel.Mnemonic]: () => {
    const mnemonic = generateMnemonic(128);
    return mnemonic;
  },
  [IpcChannel.RailgunAddress]: async(mnemonic: string) => {
    const wallet = await Railgun.getWallet(mnemonic);
    return wallet.getAddress();
  },
  [IpcChannel.Withdraw]: async(
    mnemonic: string,
    amount: bigint,
    manifoldUser: string,
  ) => {
    await Railgun.withdraw(mnemonic, amount, manifoldUser);
  },
};

const initialize = () => {
  Object.entries(requests)
    .forEach(([channelName, channelHandler]) => {
      ipcMain.handle(channelName, (event, ...parameters) => (
        channelHandler(...parameters)
      ));
    });

  Railgun.events.on('balance', (balance: bigint) => {
    console.log('balance event emitted', balance);
    const mainWindow = WindowManager.getMainWindow();
    mainWindow?.webContents.send('Balance', balance);
  });
};

export default {
  initialize,
};
