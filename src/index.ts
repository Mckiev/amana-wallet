import { toast } from 'react-toastify';
import { Logger } from './logger';
import render from './render';
import railgun from './railgun';
import DataFetcher from './DataFetcher';
import store from './redux/store';
import { AccountActions } from './redux/slices/account';
import type { TransactionLog } from './types';
import { LogsActions } from './redux/slices/logs';

const handleBalanceUpdate = (balance: bigint): void => {
  const state = store.getState();
  if (state.account.balance !== balance.toString()) {
    const action = AccountActions.updateBalance(balance.toString());
    toast(`Balance updated to ${balance}`);
    store.dispatch(action);
  }
};

const handleTransactions = (transactions: TransactionLog[]): void => {
  const action = LogsActions.setTransactions(transactions);
  store.dispatch(action);
};

const main = async(): Promise<void> => {
  render();
  await railgun.initialize();
  railgun.onBalanceUpdate(handleBalanceUpdate);
  railgun.onTransactions(handleTransactions);
  await DataFetcher.initialize();
};

main().catch((e: unknown) => {
  if (e instanceof Error) {
    Logger.fatal(e.message);
  } else if (typeof e === 'string') {
    Logger.fatal(e);
  } else {
    Logger.fatal('Unknown error');
  }
});
