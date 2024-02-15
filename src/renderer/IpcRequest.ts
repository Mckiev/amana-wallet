import { ipcRenderer } from 'electron';
import { IpcChannel } from '../common/ipcChannels';
import store from './redux/store';
import { AccountActions } from './redux/slices/account';

type IpcRequest = (...parameters: any[]) => Promise<any>;
type IpcRequests = Record<IpcChannel, IpcRequest>;

const IpcRequest: IpcRequests = {
  [IpcChannel.Mnemonic]: async (): Promise<string> => {
    const mnemonic = await ipcRenderer.invoke(IpcChannel.Mnemonic);
    return mnemonic;
  },
  [IpcChannel.RailgunAddress]: async (mnemonic: string): Promise<string> => {
    const railgunAddress: string = await ipcRenderer.invoke(IpcChannel.RailgunAddress, mnemonic);
    return railgunAddress;
  },
};

ipcRenderer.on('Balance', (event, balance: bigint) => {
  console.log('BALANCE RECEIVED:');
  console.log(typeof balance);
  console.log(balance);
  const action = AccountActions.updateBalance(balance);
  store.dispatch(action);
})

export default IpcRequest;
