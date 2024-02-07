import { createRailgunWallet } from '@railgun-community/wallet';
// import type { RailgunWalletInfo } from '@railgun-community/shared-models';
// import { NetworkName } from '@railgun-community/shared-models';
import sha256 from '../utils/sha256';

const creationBlockNumberMap = {
  Polygon: 3421400,
};

// const createWallet = async(mnemonic: string): Promise<RailgunWalletInfo> => {
//   const encryptionkey = await sha256(mnemonic);
//   const wallet = await createRailgunWallet(encryptionkey, mnemonic, creationBlockNumberMap);
//   return wallet;
// };

export const createPrimaryAddress = async(mnemonic: string): Promise<string> =>
// const wallet = await createWallet(mnemonic);
// return wallet.railgunAddress;

  // TODO:
  '0zk1qytvlgud907nxkt8ls4nnkefft4n493tgnqnjx2na9xjr3za7zss0rv7j6fe3z53luwwp0zxwrcw7ecervqmgjgev05lp63s7lexl7q28cyj6zceafz665zpkra';

