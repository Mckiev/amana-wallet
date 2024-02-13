import { createSelector } from '@reduxjs/toolkit';
import type { State } from './store';
import type { AccountState } from './slices/account';
import { Position } from '../types';

const getAccount = (state: State): AccountState => (
  state.account
);

export const getMnemonic = createSelector(
  getAccount,
  account => account.mnemonic,
);

export const getPrimaryAddress = createSelector(
  getAccount,
  account => account.primaryAddress,
);

export const getShortPrimaryAddress = createSelector(
  getPrimaryAddress,
  primaryAddress => primaryAddress === undefined
    ? undefined
    : `${primaryAddress.slice(0, 8)}...${primaryAddress.slice(primaryAddress.length - 5)}`,
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