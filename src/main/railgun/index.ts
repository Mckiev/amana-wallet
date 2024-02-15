import { NETWORK_CONFIG, NetworkName } from '@railgun-community/shared-models';

import { setEngineLoggers, initializeEngine, creationBlockNumberMap, loadEngineProvider} from './engine';
import { createRailgunWallet as createWallet, walletForID } from '@railgun-community/wallet';

export {sendTransfer} from './self-transfer';
export const {chain} = NETWORK_CONFIG[NetworkName.Polygon];
import config from '../../common/config';
import { AbstractWallet } from '@railgun-community/engine';

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

export const getWallet = async (mnemonic: string): Promise<AbstractWallet> => {
  const railgunWalletInfo = await createWallet(config.encryptionKey, mnemonic, creationBlockNumberMap);
  const wallet = walletForID(railgunWalletInfo.id);
  return wallet;
};

const initialize = async () => {
  await initializeEngine();
  await loadEngineProvider();
  setEngineLoggers();

  // await wallet.getTokenBalances(TXIDVersion.V2_PoseidonMerkle, chain, false); // onlySpendable
  // await refreshBalances(chain, undefined);
  // return wallet;
};

export default {
  initialize,
  getWallet,
}