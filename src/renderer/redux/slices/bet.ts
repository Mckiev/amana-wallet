import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { Prediction } from '../../types';

export enum BetStatus {
  None = 'None',
  UserConfirming = 'UserConfirming',
}

export type BetState = {
  status: BetStatus;
  amount: string;
  marketUrl: string;
  prediction: Prediction;
};

const initialState: BetState = {
  status: BetStatus.None,
  amount: '0',
  marketUrl: '',
  prediction: Prediction.Yes,
};

type UpdateAmount = PayloadAction<string>;
type UpdateMarketUrl = PayloadAction<string>;
type UpdatePrediction = PayloadAction<Prediction>;

const betSlice = createSlice({
  name: 'bet',
  initialState,
  reducers: {
    updateAmount: (state, action: UpdateAmount) => {
      state.amount = action.payload;
    },
    updateMarketUrl: (state, action: UpdateMarketUrl) => {
      state.marketUrl = action.payload;
    },
    updatePrediction: (state, action: UpdatePrediction) => {
      state.prediction = action.payload;
    },
    beginBet: (state) => {
      state.status = BetStatus.UserConfirming;
    },
    confirmBet: (state) => {
      state.status = BetStatus.None;
      state.amount = '0';
      state.marketUrl = '';
      state.prediction = Prediction.Yes;
    },
    cancelBet: (state) => {
      state.status = BetStatus.None;
    },
  },
});

export const BetActions = betSlice.actions;

export default betSlice.reducer;
