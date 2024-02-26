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

let primaryWalletId: string | undefined;

const getWallet = async(mnemonic: string): Promise<AbstractWallet> => {
  const railgunWalletInfo = await createWallet(
    config.encryptionKey,
    mnemonic,
    creationBlockNumberMap,
  );
  if (primaryWalletId === undefined) {
    primaryWalletId = railgunWalletInfo.id;
  }
  const wallet = walletForID(railgunWalletInfo.id);
  await refreshBalances(chain, undefined);
  return wallet;
};

const onBalanceUpdateCallback = (
  async(e: RailgunBalancesEvent): Promise<void> => {
    const isPrimaryWallet = e.railgunWalletID === primaryWalletId;
    const amana = e.erc20Amounts.find(erc20Amount => (
      erc20Amount.tokenAddress === constants.TOKENS.AMANA
    ));
    const amanaBalance = amana?.amount ?? 0n;
    if (isPrimaryWallet) {
      events.emit('balance', amanaBalance);
    } else if (amanaBalance > 0n) {
      // TODO: sweep funds to primary wallet
    }
    const wallet = walletForID(e.railgunWalletID);
    const transactions = await wallet.getTransactionHistory(chain, undefined);
    const transactionLogs: TransactionLog[] = [];
    transactions.forEach((transaction) => {
      if (typeof transaction.timestamp !== 'number') {
        return;
      }
      const timestamp = Math.floor(transaction.timestamp * 1000);
      if (transaction.receiveTokenAmounts.length > 0) {
        const amanaAmounts = transaction.receiveTokenAmounts.filter(amount => (
          amount.tokenData.tokenAddress === constants.TOKENS.AMANA
        ));
        if (amanaAmounts.length === 0) {
          return;
        }
        const memoText = typeof amanaAmounts[0]?.memoText === 'string'
          ? amanaAmounts[0]?.memoText
          : undefined;
        const amount = amanaAmounts.reduce(
          (sum, amanaAmount) => (
            sum + amanaAmount.amount
          ),
          0n,
        );
        transactionLogs.push({
          type: TransactionType.Incoming,
          txid: transaction.txid,
          timestamp,
          amount: amount.toString(),
          memoText,
        });
      } else {
        const amanaAmounts = transaction.transferTokenAmounts.filter(amount => (
          amount.tokenData.tokenAddress === constants.TOKENS.AMANA
        ));
        if (amanaAmounts.length === 0) {
          return;
        }
        const memoText = typeof amanaAmounts[0]?.memoText === 'string'
          ? amanaAmounts[0]?.memoText
          : undefined;
        const amount = amanaAmounts.reduce(
          (sum, amanaAmount) => (
            sum + amanaAmount.amount
          ),
          0n,
        );
        transactionLogs.push({
          type: TransactionType.Outgoing,
          txid: transaction.txid,
          timestamp,
          amount: amount.toString(),
          memoText,
        });
      }
    });
    if (isPrimaryWallet) {
      events.emit('transactions', transactionLogs);
    }
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

const bet = async(
  mnemonic: string,
  amount: bigint,
  marketUrl: string,
  prediction: string,
): Promise<void> => {
  const wallet = await getWallet(mnemonic);
  const to = constants.RAILGUN.BOT_ADDRESS;
  const transactions = await wallet.getTransactionHistory(chain, undefined);
  const nonce = transactions.length + 1;
  const redemptionWallet = await createWallet(
    config.encryptionKey,
    mnemonic,
    creationBlockNumberMap,
    nonce,
  );
  const redemptionAddress = redemptionWallet.railgunAddress;
  const memoText = [
    'bet',
    marketUrl,
    prediction,
    redemptionAddress,
  ].join('::');
  await sendTransfer(wallet.id, to, memoText, amount);
};

export default {
  initialize,
  getWallet,
  events,
  withdraw,
  bet,
};
