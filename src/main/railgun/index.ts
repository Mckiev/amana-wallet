import EventEmitter from 'events';
import type { RailgunBalancesEvent } from '@railgun-community/shared-models';
import { NETWORK_CONFIG, NetworkName, TXIDVersion } from '@railgun-community/shared-models';
import { createRailgunWallet as createWallet, refreshBalances, setOnBalanceUpdateCallback, walletForID } from '@railgun-community/wallet';
import type { AbstractWallet } from '@railgun-community/engine';
import config from '../../common/config';
import constants from '../../common/constants';
import { setEngineLoggers, initializeEngine, creationBlockNumberMap, loadEngineProvider } from './engine';
import { sendTransfer } from './self-transfer';

export { sendTransfer } from './self-transfer';
export const { chain } = NETWORK_CONFIG[NetworkName.Polygon];

// const wallets: Record<string, AbstractWallet | undefined> = {};

// export const getWallet = async (mnemonic: string): Promise<AbstractWallet> => {
//   const cachedWallet = wallets[mnemonic];
//   if (cachedWallet !== undefined) {
//     return cachedWallet;
//   }
//   const railgunWalletInfo = await createWallet(config.encryptionKey, mnemonic, creationBlockNumberMap);
//   const wallet = walletForID(railgunWalletInfo.id);
//   wallets[mnemonic] = wallet;
//   return wallet;
// };

const events = new EventEmitter();

export const getWallet = async(mnemonic: string): Promise<AbstractWallet> => {
  const railgunWalletInfo = await createWallet(config.encryptionKey, mnemonic, creationBlockNumberMap);
  const wallet = walletForID(railgunWalletInfo.id);
  await refreshBalances(chain, undefined);
  const tokenBalances = await wallet.getTokenBalances(TXIDVersion.V3_PoseidonMerkle, chain, true);
  return wallet;
};

const onBalanceUpdateCallback = ((event: RailgunBalancesEvent) => {
  console.log('onBalanceUpdateCallback', event);
  // TODO: filter by event.railgunWalletID
  // Amana balance
  const amana = event.erc20Amounts.find(erc20Amount => erc20Amount.tokenAddress === constants.TOKENS.AMANA);
  const amanaBalance = amana?.amount ?? 0n;
  events.emit('balance', amanaBalance);
});

const initialize = async() => {
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
