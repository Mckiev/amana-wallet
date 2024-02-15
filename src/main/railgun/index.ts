import EventEmitter from 'events';
import { NETWORK_CONFIG, NetworkName, RailgunBalancesEvent, TXIDVersion } from '@railgun-community/shared-models';
import { setEngineLoggers, initializeEngine, creationBlockNumberMap, loadEngineProvider} from './engine';
import { createRailgunWallet as createWallet, refreshBalances, setOnBalanceUpdateCallback, walletForID } from '@railgun-community/wallet';

export {sendTransfer} from './self-transfer';
export const {chain} = NETWORK_CONFIG[NetworkName.Polygon];
import config from '../../common/config';
import { AbstractWallet } from '@railgun-community/engine';
import constants from '../../common/constants';

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

export const getWallet = async (mnemonic: string): Promise<AbstractWallet> => {
  const railgunWalletInfo = await createWallet(config.encryptionKey, mnemonic, creationBlockNumberMap);
  const wallet = walletForID(railgunWalletInfo.id);
  const tokenBalances = await wallet.getTokenBalances(TXIDVersion.V3_PoseidonMerkle, chain, true);
  console.log('tokenBalances', tokenBalances);
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

const initialize = async () => {
  console.log('initializing engine');
  await initializeEngine();
  console.log('initialized engine');
  await loadEngineProvider();
  console.log('setting engine loggers');
  setEngineLoggers();
  console.log('set engine loggers');
  setOnBalanceUpdateCallback(onBalanceUpdateCallback);

  // await wallet.getTokenBalances(TXIDVersion.V2_PoseidonMerkle, chain, false); // onlySpendable
  // await refreshBalances(chain, undefined);
  // return wallet;
};

export default {
  initialize,
  getWallet,
  events,
}