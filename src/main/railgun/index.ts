import EventEmitter from 'events';
import type { RailgunBalancesEvent } from '@railgun-community/shared-models';
import { NETWORK_CONFIG, NetworkName } from '@railgun-community/shared-models';
import { createRailgunWallet, refreshBalances, setOnBalanceUpdateCallback, signWithWalletViewingKey, walletForID, pbkdf2 } from '@railgun-community/wallet';
import type { AbstractWallet } from '@railgun-community/engine';
import { ByteLength, formatToByteLength, nToHex, WalletNode } from '@railgun-community/engine';
import { bech32m } from '@scure/base';
import xor from 'buffer-xor';
import Logger from 'eleventh';
import { InfuraProvider } from 'ethers';
import constants from '../../common/constants';
import { TransactionType, type TransactionLog } from '../../common/types';
import { setEngineLoggers, initializeEngine, creationBlockNumberMap, loadEngineProvider } from './engine';
import { sendTransfer } from './self-transfer';

// Hex value of message string: "Redeem AMANA Bet"
const REDEEM_MESSAGE_HEX = '52656465656d20414d414e4120426574';

const { chain } = NETWORK_CONFIG[NetworkName.Polygon];

const events = new EventEmitter();

let primaryWalletId: string | undefined;
let primaryEncryptionKey: string | undefined;
// fixing a salt value, since encryption key is derived
// from mnemonic which is by definition unique
const salt = '0101010101010101';
const iterations = 100000;

const getWalletAndKey = async(mnemonic: string):
Promise<{
  wallet: AbstractWallet;
  encryptionKey: string;
}> => {
  primaryEncryptionKey = await pbkdf2(mnemonic, salt, iterations);
  const railgunWalletInfo = await createRailgunWallet(
    primaryEncryptionKey,
    mnemonic,
    creationBlockNumberMap,
  );
  if (primaryWalletId === undefined) {
    primaryWalletId = railgunWalletInfo.id;
  }
  const wallet = walletForID(railgunWalletInfo.id);
  await refreshBalances(chain, [railgunWalletInfo.id]);
  return { wallet, encryptionKey: primaryEncryptionKey };
};

const getPrimaryWallet = (): AbstractWallet => {
  if (primaryWalletId === undefined) {
    throw new Error('Primary wallet ID is undefined');
  }
  return walletForID(primaryWalletId);
};

const getEncryptionKey = (): string => {
  if (primaryEncryptionKey === undefined) {
    throw new Error('Encryption key is undefined');
  }
  return primaryEncryptionKey;
};

const sweep = async(from: string, amount: bigint): Promise<void> => {
  const wallet = walletForID(from);
  const encryptionKey = getEncryptionKey();
  const to = getPrimaryWallet().getAddress();
  const memoText = `sweep:${wallet.getAddress()}`;
  Logger.info('Sweeping funds from redemption wallet', { from, to, amount: amount.toString() });
  await sendTransfer(from, encryptionKey, to, memoText, amount, false);
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
      await sweep(e.railgunWalletID, amanaBalance);
    }
    const wallet = walletForID(e.railgunWalletID);
    const transactions = await wallet.getTransactionHistory(chain, undefined);
    const transactionLogs: TransactionLog[] = [];
    for (const transaction of transactions) {
      if (typeof transaction.timestamp !== 'number') {
        const provider = new InfuraProvider(137);
        // eslint-disable-next-line no-await-in-loop
        const block = await provider.getBlock(transaction.blockNumber);
        // Use the block's timestamp if available
        // Otherwise, revert to the current time (not ideal, but better than 0)
        transaction.timestamp = block?.timestamp ?? Date.now() / 1000;
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
    }

    if (isPrimaryWallet) {
      events.emit('transactions', transactionLogs);
    }
  }
);

const initialize = async(identifier: string): Promise<void> => {
  await initializeEngine(identifier);
  await loadEngineProvider();
  setEngineLoggers();
  setOnBalanceUpdateCallback(onBalanceUpdateCallback);
};

const withdraw = async(
  mnemonic: string,
  encryptionKey: string,
  amount: bigint,
  manifoldUser: string,
): Promise<void> => {
  const wallet = getPrimaryWallet();
  const to = constants.RAILGUN.BOT_ADDRESS;
  const memoText = `withdraw:${manifoldUser}`;
  await sendTransfer(wallet.id, encryptionKey, to, memoText, amount);
};

const bet = async(
  mnemonic: string,
  encryptionKey: string,
  amount: bigint,
  marketUrl: string,
  prediction: string,
): Promise<void> => {
  const wallet = getPrimaryWallet();
  const to = constants.RAILGUN.BOT_ADDRESS;
  const transactions = await wallet.getTransactionHistory(chain, undefined);
  const betTransactions = transactions.filter(transaction => (
    transaction.transferTokenAmounts.find((tokenAmount) => {
      const memo: unknown = tokenAmount.memoText;
      return typeof memo === 'string' && memo.startsWith('bet');
    }) !== undefined
  ));
  const nonce = betTransactions.length + 1;

  const redemptionWallet = await createRailgunWallet(
    encryptionKey,
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
  await sendTransfer(wallet.id, encryptionKey, to, memoText, amount);
};

const getRedemptionWalletId = async(
  mnemonic: string,
  encryptionKey: string,
  address: string,
): Promise<string> => {
  const primary = getPrimaryWallet();
  const transactions = await primary.getTransactionHistory(chain, undefined);
  const maxNonce = transactions.length + 1;
  for (let nonce = 1; nonce <= maxNonce; nonce += 1) {
    // eslint-disable-next-line no-await-in-loop
    const wallet = await createRailgunWallet(
      encryptionKey,
      mnemonic,
      creationBlockNumberMap,
      nonce,
    );
    if (wallet.railgunAddress === address) {
      return wallet.id;
    }
  }
  throw new Error('Redemption wallet not found');
};

const signRedemption = async(
  mnemonic: string,
  encryptionKey: string,
  redemptionAddress: string,
): Promise<string> => {
  const walletId = await getRedemptionWalletId(
    mnemonic,
    encryptionKey,
    redemptionAddress,
  );
  const signature = await signWithWalletViewingKey(
    walletId,
    REDEEM_MESSAGE_HEX,
  );
  return signature;
};

const DERIVATION_PATH_PREFIXES = {
  SPENDING: "m/44'/1984'/0'/0'/",
  VIEWING: "m/420'/1984'/0'/0'/",
};
const ADDRESS_LENGTH_LIMIT = 127;
const PREFIX = '0zk';

const mnemonicToAddress = async(mnemonic: string): Promise<string> => {
  const index = 0;
  const paths = {
    spending: `${DERIVATION_PATH_PREFIXES.SPENDING}${index}'`,
    viewing: `${DERIVATION_PATH_PREFIXES.VIEWING}${index}'`,
  };
  const nodes = {
    spending: WalletNode.fromMnemonic(mnemonic).derive(paths.spending),
    viewing: WalletNode.fromMnemonic(mnemonic).derive(paths.viewing),
  };
  const viewingPublicKeyPair = (await nodes.viewing.getViewingKeyPair());
  const spendingPublicKey = nodes.spending.getSpendingKeyPair().pubkey[0];

  const masterPublicKey = nToHex(spendingPublicKey, ByteLength.UINT_256, false);
  const viewingPublicKey = formatToByteLength(
    viewingPublicKeyPair.pubkey,
    ByteLength.UINT_256,
  );

  // const masterPublicKey = spendingPublicKey.toString();
  // const viewingPublicKey = viewingKeyPair.pubkey.toString();

  const chainIDBuffer = Buffer.from('89', 'hex'); // 137 in hex
  const railgunBuffer = Buffer.from('railgun', 'utf8');
  const networkID = xor(chainIDBuffer, railgunBuffer).toString('hex');
  const version = '01';
  const addressString = `${version}${masterPublicKey}${networkID}${viewingPublicKey}`;
  const addressBuffer = Buffer.from(addressString, 'hex');
  const address = bech32m.encode(
    PREFIX,
    bech32m.toWords(addressBuffer),
    ADDRESS_LENGTH_LIMIT,
  );
  return address;
};

export default {
  initialize,
  getWalletAndKey,
  events,
  withdraw,
  bet,
  signRedemption,
  mnemonicToAddress,
};
