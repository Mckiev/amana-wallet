import { ipcRenderer } from 'electron';
import { toast } from 'react-toastify';
import { IpcChannel } from '../common/ipcChannels';
import store from './redux/store';
import { AccountActions } from './redux/slices/account';

type IpcRequest = (...parameters: any[]) => Promise<any>;
type IpcRequests = Record<IpcChannel, IpcRequest>;

const ipcRequest: IpcRequests = {
  [IpcChannel.Mnemonic]: async(): Promise<string> => {
    const mnemonic = await ipcRenderer.invoke(IpcChannel.Mnemonic);
    return mnemonic;
  },
  [IpcChannel.RailgunAddress]: async(mnemonic: string): Promise<string> => {
    const railgunAddress: string = await ipcRenderer.invoke(IpcChannel.RailgunAddress, mnemonic);
    return railgunAddress;
  },
};

ipcRenderer.on('Balance', (e, balance: bigint) => {
  const action = AccountActions.updateBalance(balance.toString());
  toast(`Balance updated to ${balance}`);
  store.dispatch(action);
});

export default ipcRequest;
