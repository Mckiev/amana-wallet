export enum TransactionType {
  Incoming = 'Incoming',
  Outgoing = 'Outgoing',
}

export type TransactionLog = {
  type: TransactionType;
  txid: string;
  timestamp: number;
  amount: string;
  memoText?: string;
};

type ObjectRecord = Record<string, unknown>;

export const isObjectRecord = (value: unknown): value is ObjectRecord => (
  typeof value === 'object'
    && !Array.isArray(value)
    && value !== null
);

export enum Prediction {
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
  timestamp: number;
  purchasePrice: number;
  redemptionAddress: string;
};
