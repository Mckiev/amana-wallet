import { createSelector } from '@reduxjs/toolkit';
import type { Position } from '../types';
import type { State } from './store';
import type { AccountState } from './slices/account';
import type { WithdrawalState } from './slices/withdrawal';

const getAccount = (state: State): AccountState => (
  state.account
);

export const getIsImporting = createSelector(
  getAccount,
  account => account.isImporting,
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

export const getIsLoggedIn = createSelector(
  getPrimaryAddress,
  primaryAddress => primaryAddress !== undefined,
);

export const getLogs = (state: State): string[] => (
  state.logs.logs
);

export const getPositions = (state: State): Position[] => (
  state.positions.positions
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
  withdrawal => withdrawal.amount,
);
