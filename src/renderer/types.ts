export enum Prediction {
  Unselected = 'Unselected',
  Yes = 'YES',
  No = 'NO',
}

export enum ShareType {
  yes = 'YES',
  no = 'NO',
}

export enum BetState {
  Placing = 'Placing',
  Placed = 'Placed',
  Redeeming = 'Redeeming',
  Redeemed = 'Redeemed',
  Failed = 'Failed',
}

export type Position = {
  id: string;
  url: string;
  prediction: Prediction;
  shares: number;
  state: BetState;
};
