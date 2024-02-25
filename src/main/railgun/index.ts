import EventEmitter from 'events';
import type { RailgunBalancesEvent } from '@railgun-community/shared-models';
import { NETWORK_CONFIG, NetworkName } from '@railgun-community/shared-models';
import { createRailgunWallet as createWallet, refreshBalances, setOnBalanceUpdateCallback, walletForID } from '@railgun-community/wallet';
import type { AbstractWallet } from '@railgun-community/engine';
import config from '../../common/config';
import constants from '../../common/constants';
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

const onBalanceUpdateCallback = ((e: RailgunBalancesEvent): void => {
  // TODO: filter by event.railgunWalletID
  // Amana balance
  const amana = e.erc20Amounts.find(erc20Amount => (
    erc20Amount.tokenAddress === constants.TOKENS.AMANA
  ));
  const amanaBalance = amana?.amount ?? 0n;
  events.emit('balance', amanaBalance);
});

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
