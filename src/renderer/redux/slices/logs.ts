import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { TransactionLog } from '../../../common/types';

export type LogsState = {
  transactions: TransactionLog[];
};

const initialState: LogsState = {
  transactions: [],
};

type AddLogAction = PayloadAction<TransactionLog[]>;

const logsSlice = createSlice({
  name: 'logs',
  initialState,
  reducers: {
    setTransactions: (state, action: AddLogAction) => {
      state.transactions = action.payload.sort((a, b) => (
        b.timestamp - a.timestamp
      ));
    },
  },
});

export const LogsActions = logsSlice.actions;

export default logsSlice.reducer;
