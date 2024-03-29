import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { BetState, type Position } from '../../types';

export type PositionsState = {
  positions: Position[];
  redeemingPositionId?: string;
};

const initialState: PositionsState = {
  positions: [],
};

type AddPositionAction = PayloadAction<Position[]>;
type BeginRedeemingAction = PayloadAction<string>;

const isPriorityBetState = (state: BetState): boolean => (
  state === BetState.Placed || state === BetState.Redeeming
);

const positionsSlice = createSlice({
  name: 'positions',
  initialState,
  reducers: {
    setPositions: (state, action: AddPositionAction) => {
      state.positions = action.payload.sort((a, b) => {
        if (isPriorityBetState(a.state) && !isPriorityBetState(b.state)) {
          return -1;
        }
        if (isPriorityBetState(b.state) && !isPriorityBetState(a.state)) {
          return 1;
        }
        return b.timestamp - a.timestamp;
      });
    },
    beginRedeeming: (state, action: BeginRedeemingAction) => {
      state.redeemingPositionId = action.payload;
    },
    completeRedeeming: (state) => {
      const position = state.positions.find(({ id }) => (
        id === state.redeemingPositionId
      ));
      if (position !== undefined) {
        position.state = BetState.Redeeming;
      }
      state.redeemingPositionId = undefined;
    },
    cancelRedeeming: (state) => {
      state.redeemingPositionId = undefined;
    },
  },
});

export const PositionsActions = positionsSlice.actions;

export default positionsSlice.reducer;
