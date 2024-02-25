import EventEmitter from 'events';
import type { RailgunBalancesEvent } from '@railgun-community/shared-models';
import { NETWORK_CONFIG, NetworkName } from '@railgun-community/shared-models';
import { createRailgunWallet as createWallet, refreshBalances, setOnBalanceUpdateCallback, walletForID } from '@railgun-community/wallet';
import type { AbstractWallet } from '@railgun-community/engine';
import config from '../../common/config';
import constants from '../../common/constants';
import { TransactionType, type TransactionLog } from '../../common/types';
import { setEngineLoggers, initializeEngine, creationBlockNumberMap, loadEngineProvider } from './engine';
import { sendTransfer } from './self-transfer';

const { chain } = NETWORK_CONFIG[NetworkName.Polygon];

const events = new EventEmitter();

const getWallet = async(mnemonic: string): Promise<AbstractWallet> => {
  const railgunWalletInfo = await createWallet(
    config.encryptionKey,
    mnemonic,
    creationBlockNumberMap,
  );
  const wallet = walletForID(railgunWalletInfo.id);
  await refreshBalances(chain, undefined);
  return wallet;
};

const onBalanceUpdateCallback = (
  async(e: RailgunBalancesEvent): Promise<void> => {
  // TODO: filter by event.railgunWalletID
  // Amana balance
    const amana = e.erc20Amounts.find(erc20Amount => (
      erc20Amount.tokenAddress === constants.TOKENS.AMANA
    ));
    const amanaBalance = amana?.amount ?? 0n;
    events.emit('balance', amanaBalance);
    const wallet = walletForID(e.railgunWalletID);
    const transactions = await wallet.getTransactionHistory(chain, undefined);
    const transactionLogs: TransactionLog[] = [];
    transactions.forEach((transaction) => {
      if (typeof transaction.timestamp !== 'number') {
        return;
      }
      const timestamp = Math.floor(transaction.timestamp * 1000);
      if (transaction.receiveTokenAmounts.length > 0) {
        const token = transaction
          .receiveTokenAmounts[0]?.tokenData.tokenAddress;
        if (token !== constants.TOKENS.AMANA) {
          return;
        }
        const memoText = typeof transaction.receiveTokenAmounts[0]?.memoText === 'string'
          ? transaction.receiveTokenAmounts[0]?.memoText
          : undefined;
        const amount = transaction.receiveTokenAmounts[0]?.amount ?? 0n;
        transactionLogs.push({
          type: TransactionType.Incoming,
          txid: transaction.txid,
          timestamp,
          amount: amount.toString(),
          memoText,
        });
      } else {
        const token = transaction
          .transferTokenAmounts[0]?.tokenData.tokenAddress;
        if (token !== constants.TOKENS.AMANA) {
          return;
        }
        const memoText = typeof transaction.transferTokenAmounts[0]?.memoText === 'string'
          ? transaction.transferTokenAmounts[0]?.memoText
          : undefined;
        const amount = transaction.transferTokenAmounts[0]?.amount ?? 0n;
        transactionLogs.push({
          type: TransactionType.Outgoing,
          txid: transaction.txid,
          timestamp,
          amount: amount.toString(),
          memoText,
        });
      }
    });
    events.emit('transactions', transactionLogs);
  }
);

const initialize = async(): Promise<void> => {
  await initializeEngine();
  await loadEngineProvider();
  setEngineLoggers();
  setOnBalanceUpdateCallback(onBalanceUpdateCallback);
};

const withdraw = async(
  mnemonic: string,
  amount: bigint,
  manifoldUser: string,
): Promise<void> => {
  const wallet = await getWallet(mnemonic);
  const to = constants.RAILGUN.BOT_ADDRESS;
  const memoText = `withdraw:${manifoldUser}`;
  await sendTransfer(wallet.id, to, memoText, amount);
};

export default {
  initialize,
  getWallet,
  events,
  withdraw,
};
