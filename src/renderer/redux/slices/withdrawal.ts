import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

export enum WithdrawalStatus {
  None = 'None',
  UserConfirming = 'UserConfirming',
}

export type WithdrawalState = {
  status: WithdrawalStatus;
  manifoldUser: string;
  amount: string;
};

const initialState: WithdrawalState = {
  status: WithdrawalStatus.None,
  manifoldUser: '',
  amount: '0',
};

type UpdateManifolduser = PayloadAction<string>;
type UpdateAmount = PayloadAction<string>;

const withdrawalSlice = createSlice({
  name: 'withdrawal',
  initialState,
  reducers: {
    updateManifoldUser: (state, action: UpdateManifolduser) => {
      state.manifoldUser = action.payload;
    },
    updateAmount: (state, action: UpdateAmount) => {
      state.amount = action.payload;
    },
    beginWithdrawal: (state) => {
      state.status = WithdrawalStatus.UserConfirming;
    },
    confirmWithdrawal: (state) => {
      state.status = WithdrawalStatus.None;
      state.amount = '0';
    },
    cancelWithdrawal: (state) => {
      state.status = WithdrawalStatus.None;
    },
  },
});

export const WithdrawalActions = withdrawalSlice.actions;

export default withdrawalSlice.reducer;
