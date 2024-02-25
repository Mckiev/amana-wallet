import type { TransactionGasDetails,
  RailgunERC20AmountRecipient } from '@railgun-community/shared-models';
import {
  TXIDVersion,
  NetworkName,
  EVMGasType,
  NETWORK_CONFIG,
} from '@railgun-community/shared-models';
import {
  gasEstimateForUnprovenTransfer,
  generateTransferProof,
  populateProvedTransfer,
  refreshBalances,
} from '@railgun-community/wallet';
import { parseUnits } from 'ethers';
import Logger from 'eleventh';
import config from '../../common/config';
import constants from '../../common/constants';

const { chain } = NETWORK_CONFIG[NetworkName.Polygon];

export async function sendTransfer(
  fromWalletId: string,
  recipientAddress: string,
  memoText: string,
  amount: bigint,
): Promise<undefined> {
  // Formatted token amounts to transfer.
  const erc20AmountRecipients: RailgunERC20AmountRecipient[] = [
    {
      tokenAddress: constants.TOKENS.AMANA,
      amount, // hexadecimal amount equivalent to 16
      recipientAddress,
    },
  ];

  // False if sending with Relayer.
  // True if self-signing with public wallet. See "UX: Private Transactions".
  const sendWithPublicWallet = true;

  const originalGasEstimate = 0n; // Always 0, we don't have this yet.

  const evmGasType = EVMGasType.Type2;
  const maxFeePerGas = parseUnits('100', 'gwei');
  const maxPriorityFeePerGas = parseUnits('50', 'gwei');

  const originalGasDetails: TransactionGasDetails = {
    evmGasType,
    gasEstimate: originalGasEstimate,
    maxFeePerGas,
    maxPriorityFeePerGas,
  };

  // Need to refresh balances, or wallet may try to spend already spent UTXOs.
  await refreshBalances(chain, undefined);

  const { gasEstimate } = await gasEstimateForUnprovenTransfer(
    TXIDVersion.V2_PoseidonMerkle,
    NetworkName.Polygon,
    fromWalletId,
    config.encryptionKey,
    memoText,
    erc20AmountRecipients,
    [], // nftAmountRecipients
    originalGasDetails,
    undefined,
    sendWithPublicWallet,
  );

  const transactionGasDetails: TransactionGasDetails = {
    evmGasType,
    gasEstimate,
    maxFeePerGas,
    maxPriorityFeePerGas,
  };

  const progressCallback = (progress: number): void => {
    Logger.info(`Transfer proof progress: ${progress}`);
  };

  // Allow recipient to see RAILGUN address of sender
  const showSenderAddressToRecipient: boolean = false;

  await generateTransferProof(
    TXIDVersion.V2_PoseidonMerkle,
    NetworkName.Polygon,
    fromWalletId,
    config.encryptionKey,
    showSenderAddressToRecipient,
    memoText,
    erc20AmountRecipients,
    [], // nftAmountRecipients
    undefined, // relayerFeeERC20AmountRecipient
    sendWithPublicWallet,
    undefined, // overallBatchMinGasPrice
    progressCallback,
  );

  const populateResponse = await populateProvedTransfer(
    TXIDVersion.V2_PoseidonMerkle,
    NetworkName.Polygon,
    fromWalletId,
    showSenderAddressToRecipient,
    memoText,
    erc20AmountRecipients,
    [], // nftAmountRecipients
    undefined, // relayerFeeERC20AmountRecipient,
    sendWithPublicWallet,
    undefined, // overallBatchMinGasPrice,
    transactionGasDetails,
  );

  const { data, gasLimit } = populateResponse.transaction;

  if (gasLimit === undefined) {
    throw new Error('Unable to estimate gas limit');
  }

  const host = 'http://localhost:9000'; // TODO: use production host, use config

  const endpoint = `${host}/send-transaction`;

  await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      data,
      gasLimit: gasLimit.toString(),
    }),
  });
}
