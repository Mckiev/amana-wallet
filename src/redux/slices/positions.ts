import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { Position, PositionStatus, Prediction } from '../../types';

export type PositionsState = {
  positions: Position[];
};

const initialState: PositionsState = {
  // TODO:
  positions: [
    {
      url: 'https://manifold.markets/josh/will-openofficeorg-be-officially-de',
      prediction: Prediction.Yes,
      shares: 500,
      status: PositionStatus.Open,
    },
    {
      url: 'https://manifold.markets/toms/will-an-accredited-us-college-or-un',
      prediction: Prediction.No,
      shares: 250,
      status: PositionStatus.Open,
    },
    {
      url: 'https://manifold.markets/Sss19971997/will-llama3-use-dpo',
      prediction: Prediction.Yes,
      shares: 400,
      status: PositionStatus.Closed,
    }
  ],
};

type AddPositionAction = PayloadAction<Position>;

const positionsSlice = createSlice({
  name: 'positions',
  initialState,
  reducers: {
    addPosition: (state, action: AddPositionAction) => {
      const position = action.payload;
      state.positions.push(position);
    },
  },
});

export const PositionsActions = positionsSlice.actions;

export default positionsSlice.reducer;
