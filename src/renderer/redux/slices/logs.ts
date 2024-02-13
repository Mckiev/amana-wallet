import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

export type LogsState = {
  logs: string[];
};

const initialState: LogsState = {
  // TODO:
  logs: [
    'Example log... Deposit was processed successfully',
    'Example log... Bet was placed successfully',
    'Example log... Bet was redeemed successfully',
    'Example log... Withdrawal was processed successfully',
  ],
};

type AddLogAction = PayloadAction<string>;

const logsSlice = createSlice({
  name: 'logs',
  initialState,
  reducers: {
    addLog: (state, action: AddLogAction) => {
      const log = action.payload;
      state.logs.push(log);
    },
  },
});

export const LogsActions = logsSlice.actions;

export default logsSlice.reducer;
