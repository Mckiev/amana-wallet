import { createSelector } from '@reduxjs/toolkit';
import type { Position, TransactionLog } from '../types';
import type { State } from './store';
import type { AccountState } from './slices/account';
import type { WithdrawalState } from './slices/withdrawal';
import type { BetState } from './slices/bet';

const getAccount = (state: State): AccountState => (
  state.account
);

export const getLoginState = createSelector(
  getAccount,
  account => account.loginState,
);

export const getEncryptionKey = createSelector(
  getAccount,
  account => account.encryptionKey,
);

export const getMnemonic = createSelector(
  getAccount,
  account => account.mnemonic,
);

export const getPrimaryAddress = createSelector(
  getAccount,
  account => account.primaryAddress,
);

export const getBalance = createSelector(
  getAccount,
  account => BigInt(account.balance),
);

export const getShortPrimaryAddress = createSelector(
  getPrimaryAddress,
  primaryAddress => (primaryAddress === undefined
    ? undefined
    : `${primaryAddress.slice(0, 8)}...${primaryAddress.slice(primaryAddress.length - 5)}`),
);

export const getTransactions = (state: State): TransactionLog[] => (
  state.logs.transactions
);

export const getPositions = (state: State): Position[] => (
  state.positions.positions
);

export const getRedeemingPositionId = (state: State): string | undefined => (
  state.positions.redeemingPositionId
);

export const getRedeemingPosition = createSelector(
  getPositions,
  getRedeemingPositionId,
  (positions, redeemingPositionId) => positions.find(position => (
    position.id === redeemingPositionId
  )),
);

export const getWithdrawal = (state: State): WithdrawalState => (
  state.withdrawal
);

export const getWithdrawalStatus = createSelector(
  getWithdrawal,
  withdrawal => withdrawal.status,
);

export const getWithdrawalManifoldUser = createSelector(
  getWithdrawal,
  withdrawal => withdrawal.manifoldUser,
);

export const getWithdrawalAmount = createSelector(
  getWithdrawal,
  withdrawal => BigInt(withdrawal.amount),
);

export const getBet = (state: State): BetState => (
  state.bet
);

export const getBetStatus = createSelector(
  getBet,
  bet => bet.status,
);

export const getBetAmount = createSelector(
  getBet,
  bet => BigInt(bet.amount),
);

export const getBetMarketUrl = createSelector(
  getBet,
  bet => bet.marketUrl,
);

export const getBetPrediction = createSelector(
  getBet,
  bet => bet.prediction,
);
