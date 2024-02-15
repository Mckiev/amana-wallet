import { ipcMain } from 'electron';
import { generateMnemonic } from 'bip39';
import { IpcChannel } from '../common/ipcChannels';

type IpcHandler = (...parameters: unknown[]) => unknown;
type IpcHandlers = Record<IpcChannel, IpcHandler>;

const requests: IpcHandlers = {
  [IpcChannel.Mnemonic]: () => {
    const mnemonic = generateMnemonic(128);
    return mnemonic;
  },
  [IpcChannel.RailgunAddress]: () => {
    return '0zkabcdef123456789';
  },
};

const initialize = () => {
  Object.entries(requests)
    .forEach(([channelName, channelHandler]) => {
      ipcMain.handle(channelName, channelHandler);
    });
};

export default {
  initialize,
};
