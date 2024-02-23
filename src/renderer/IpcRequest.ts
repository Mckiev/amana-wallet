import { ipcRenderer } from 'electron';
import { toast } from 'react-toastify';
import { IpcChannel } from '../common/ipcChannels';
import store from './redux/store';
import { AccountActions } from './redux/slices/account';

type IpcRequest = (...parameters: any[]) => Promise<any>;
type IpcRequests = Record<IpcChannel, IpcRequest>;

const ipcRequest: IpcRequests = {
  [IpcChannel.Mnemonic]: async(): Promise<string> => {
    const mnemonic: unknown = await ipcRenderer.invoke(IpcChannel.Mnemonic);
    if (typeof mnemonic !== 'string') {
      throw new Error('Invalid mnemonic');
    }
    return mnemonic;
  },
  [IpcChannel.RailgunAddress]: async(mnemonic: string): Promise<string> => {
    const railgunAddress: unknown = await ipcRenderer.invoke(
      IpcChannel.RailgunAddress,
      mnemonic,
    );
    if (typeof railgunAddress !== 'string') {
      throw new Error('Invalid railgun address');
    }
    return railgunAddress;
  },
  [IpcChannel.Withdraw]: async(
    mnemonic: string,
    amount: bigint,
    manifoldUser: string,
  ): Promise<void> => {
    await ipcRenderer.invoke(
      IpcChannel.Withdraw,
      mnemonic,
      amount,
      manifoldUser,
    );
  },
};

ipcRenderer.on('Balance', (e, balance: bigint) => {
  const state = store.getState();
  if (state.account.balance !== balance.toString()) {
    const action = AccountActions.updateBalance(balance.toString());
    toast(`Balance updated to ${balance}`);
    store.dispatch(action);
  }
});

export default ipcRequest;
