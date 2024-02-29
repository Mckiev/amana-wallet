import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { Position } from '../../types';

export type PositionsState = {
  positions: Position[];
};

const initialState: PositionsState = {
  positions: [],
};

type AddPositionAction = PayloadAction<Position[]>;

const positionsSlice = createSlice({
  name: 'positions',
  initialState,
  reducers: {
    setPositions: (state, action: AddPositionAction) => {
      state.positions = action.payload.sort((a, b) => (
        b.timestamp - a.timestamp
      ));
    },
  },
});

export const PositionsActions = positionsSlice.actions;

export default positionsSlice.reducer;
