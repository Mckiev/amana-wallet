import type { TransactionGasDetails,
  RailgunERC20AmountRecipient } from '@railgun-community/shared-models';
import {
  TXIDVersion,
  NetworkName,
  EVMGasType,
} from '@railgun-community/shared-models';
import {
  gasEstimateForUnprovenTransfer,
  generateTransferProof,
  populateProvedTransfer,
  refreshBalances,
} from '@railgun-community/wallet';
import { TransactionResponse, parseUnits } from 'ethers';
import config from '../../common/config';
import constants from '../../common/constants';
import { chain } from '.';

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
    console.log(`Transfer proof progress: ${progress}`);
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

  console.log('transaction', populateResponse.transaction);

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

  // const wallet_0x = Wallet.fromPhrase(config.mnemonic, new InfuraProvider(137));
  // transaction_to_send.from = wallet_0x.address;
  // console.log(transaction_to_send);
  // // Send transaction
  // const tx = await wallet_0x.sendTransaction(transaction_to_send);
  // console.log('Sending transaction', tx.hash);
  // return tx;
}
