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
