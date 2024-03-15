// eslint-disable-next-line import/no-extraneous-dependencies
import { ipcRenderer } from 'electron';
import { toast } from 'react-toastify';
import { IpcChannel } from '../common/ipcChannels';
import { isObjectRecord, type TransactionLog } from '../common/types';
import store from './redux/store';
import { AccountActions } from './redux/slices/account';
import { LogsActions } from './redux/slices/logs';
import type { Position } from './types';
import { PositionsActions } from './redux/slices/positions';

const ipcRequest = {
  [IpcChannel.Mnemonic]: async(): Promise<string> => {
    const mnemonic: unknown = await ipcRenderer.invoke(IpcChannel.Mnemonic);
    if (typeof mnemonic !== 'string') {
      throw new Error('Invalid mnemonic');
    }
    return mnemonic;
  },
  [IpcChannel.RailgunAddressAndKey]: async(mnemonic: string):
  Promise<[string, string]> => {
    const response: unknown = await ipcRenderer.invoke(
      IpcChannel.RailgunAddressAndKey,
      mnemonic,
    );
    if (!isObjectRecord(response)) {
      throw new Error('Invalid response');
    }
    const { railgunAddress, encryptionKey } = response;
    if (typeof railgunAddress !== 'string') {
      throw new Error('Invalid railgun address');
    }
    if (typeof encryptionKey !== 'string') {
      throw new Error('Invalid encryption key');
    }
    return [railgunAddress, encryptionKey];
  },
  [IpcChannel.Withdraw]: async(
    mnemonic: string,
    encryptionKey: string,
    amount: bigint,
    manifoldUser: string,
  ): Promise<void> => {
    await ipcRenderer.invoke(
      IpcChannel.Withdraw,
      mnemonic,
      encryptionKey,
      amount,
      manifoldUser,
    );
  },
  [IpcChannel.Bet]: async(
    mnemonic: string,
    encryptionKey: string,
    amount: bigint,
    marketUrl: string,
    prediction: string,
  ): Promise<void> => {
    await ipcRenderer.invoke(
      IpcChannel.Bet,
      mnemonic,
      encryptionKey,
      amount,
      marketUrl,
      prediction,
    );
  },
  [IpcChannel.Redeem]: async(
    mnemonic: string,
    encryptionKey: string,
    redemptionAddress: string,
  ): Promise<void> => {
    await ipcRenderer.invoke(
      IpcChannel.Redeem,
      mnemonic,
      encryptionKey,
      redemptionAddress,
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

ipcRenderer.on('Transactions', (e, transactions: TransactionLog[]) => {
  const action = LogsActions.setTransactions(transactions);
  store.dispatch(action);
});

ipcRenderer.on('Positions', (e, positions: Position[]) => {
  const action = PositionsActions.setPositions(positions);
  store.dispatch(action);
});

export default ipcRequest;
