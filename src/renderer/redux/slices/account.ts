import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

export type AccountState = {
  mnemonic?: string;
  primaryAddress?: string;
  balance: bigint;
};

const initialState: AccountState = {
  mnemonic: undefined,
  primaryAddress: undefined,
  balance: 0n,
};

type ImportAccountAction = PayloadAction<{
  mnemonic: string;
  primaryAddress: string;
}>;

type UpdateBalanceAction = PayloadAction<bigint>;

const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    importAccount: (state, action: ImportAccountAction) => {
      const { mnemonic, primaryAddress } = action.payload;
      state.mnemonic = mnemonic;
      state.primaryAddress = primaryAddress;
    },
    updateBalance: (state, action: UpdateBalanceAction) => {
      state.balance = action.payload;
    },
  },
});

export const AccountActions = accountSlice.actions; 

export default accountSlice.reducer;
