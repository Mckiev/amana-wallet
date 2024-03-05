import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

export type AccountState = {
  mnemonic?: string;
  primaryAddress?: string;
  encryptionKey?: string;
  balance: string;
  isImporting: boolean;
};

const initialState: AccountState = {
  mnemonic: undefined,
  primaryAddress: undefined,
  encryptionKey: undefined,
  balance: '0',
  isImporting: false,
};

type ImportAccountAction = PayloadAction<{
  mnemonic: string;
  primaryAddress: string;
  encryptionKey: string;
}>;

type UpdateBalanceAction = PayloadAction<string>;

const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    beginImporting: (state) => {
      state.isImporting = true;
    },
    importAccount: (state, action: ImportAccountAction) => {
      const { mnemonic, primaryAddress, encryptionKey } = action.payload;
      state.mnemonic = mnemonic;
      state.primaryAddress = primaryAddress;
      state.encryptionKey = encryptionKey;
      state.isImporting = false;
    },
    updateBalance: (state, action: UpdateBalanceAction) => {
      state.balance = action.payload;
    },
  },
});

export const AccountActions = accountSlice.actions;

export default accountSlice.reducer;
