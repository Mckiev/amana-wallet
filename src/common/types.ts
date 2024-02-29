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
