export enum TransactionType {
  WITHDRAWAL = 'WITHDRAWAL',
  OVERDRAFT_FEE = 'OVERDRAFT_FEE',
  DEPOSIT = 'DEPOSIT',
}

export interface Transaction {
  date: Date;
  type: TransactionType;
  amount: number | null;
  remainingBalance: number;
}
