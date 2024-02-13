import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

export type AccountState = {
  mnemonic?: string;
  primaryAddress?: string;
};

const initialState: AccountState = {
  mnemonic: undefined,
  primaryAddress: undefined,
};

type ImportAccountAction = PayloadAction<{
  mnemonic: string;
  primaryAddress: string;
}>;

const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    importAccount: (state, action: ImportAccountAction) => {
      const { mnemonic, primaryAddress } = action.payload;
      state.mnemonic = mnemonic;
      state.primaryAddress = primaryAddress;
    },
  },
});

export const AccountActions = accountSlice.actions;

export default accountSlice.reducer;
