export enum Prediction {
  Unselected = 'Unselected',
  Yes = 'Yes',
  No = 'No',
};

export enum PositionStatus {
  Open = 'Open',
  Closing = 'Closing',
  Closed = 'Closed',
};

export type Position = {
  url: string;
  prediction: Prediction;
  shares: number;
  status: PositionStatus;
};