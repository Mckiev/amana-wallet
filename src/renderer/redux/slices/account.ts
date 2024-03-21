import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

export enum LoginState {
  Entering = 'Entering',
  Importing = 'Importing',
  Confirming = 'Confirming',
  LoggedIn = 'LoggedIn',
}

export type AccountState = {
  mnemonic?: string;
  primaryAddress?: string;
  encryptionKey?: string;
  balance: string;
  loginState: LoginState;
};

const initialState: AccountState = {
  mnemonic: undefined,
  primaryAddress: undefined,
  encryptionKey: undefined,
  balance: '0',
  loginState: LoginState.Entering,
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
      state.loginState = LoginState.Importing;
    },
    importAccount: (state, action: ImportAccountAction) => {
      const { mnemonic, primaryAddress, encryptionKey } = action.payload;
      state.mnemonic = mnemonic;
      state.primaryAddress = primaryAddress;
      state.encryptionKey = encryptionKey;
      state.loginState = LoginState.LoggedIn;
    },
    beginConfirmation: (state) => {
      state.loginState = LoginState.Confirming;
    },
    updateBalance: (state, action: UpdateBalanceAction) => {
      state.balance = action.payload;
    },
  },
});

export const AccountActions = accountSlice.actions;

export default accountSlice.reducer;
