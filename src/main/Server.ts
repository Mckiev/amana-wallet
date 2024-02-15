import { ipcMain } from 'electron';
import { generateMnemonic } from 'bip39';
import { IpcChannel } from '../common/ipcChannels';
import Railgun from './railgun';

type IpcHandler = (...parameters: any[]) => unknown;
type IpcHandlers = Record<IpcChannel, IpcHandler>;

const requests: IpcHandlers = {
  [IpcChannel.Mnemonic]: () => {
    const mnemonic = generateMnemonic(128);
    return mnemonic;
  },
  [IpcChannel.RailgunAddress]: async (mnemonic: string) => {
    const wallet = await Railgun.getWallet(mnemonic);
    return wallet.getAddress();
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
    ipcMain.emit('Balance', balance);
  });
};

export default {
  initialize,
};
