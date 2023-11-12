import { Transaction, TransactionType } from './transaction';

export const OVERDRAFT_FEE_COST = 5;

export class Account {
  private number: string;
  private pin: string; 
  private balance: number;
  private history: Transaction[] = [];

  constructor(number: string, pin: string, balance: number) {
    this.number = number;
    this.pin = pin;
    this.balance = balance;
  }

  public getNumber() {
    return this.number;
  }

  /**
    Update the balance of the account and update its history
    @param transactionType is the type of the transaction being applied to the balance of the account
    @param transactionAmount is the amount to be added to the balance of the account. It will be negative for withdrawals
  */
  private addTransaction(transactionType: TransactionType, transactionAmount: number) {
    this.balance = parseFloat((this.balance + transactionAmount).toFixed(2)); // round to ensure cents make sense
    this.history.push({ date: new Date(), type: transactionType, amount: transactionAmount, remainingBalance: this.balance });
  }

  /**
    Check the pin provided with the pin of the account 
  */
  public authorize(pin: string): boolean { // true if authorized, false if not
    return this.pin === pin;
  }

  /**
    Return the current balance of the account 
  */
  public getBalance() {
    return this.balance;
  }

  /**
    Get the history of the account 
  */
  public getHistory() {
    return Array.from(this.history).reverse(); // return history in reverse chronological order
  }

  /**
    Make a deposit to the account 
  */
  public deposit(depositAmount: number): number {
    this.addTransaction(TransactionType.DEPOSIT, depositAmount);
    return this.balance;
  }

  /**
    Withdraw from the account 
  */
  public withdraw(withdrawalAmount: number): { newBalance: number; overdrafted: boolean } {
    this.addTransaction(TransactionType.WITHDRAWAL, -withdrawalAmount);
    let overdrafted = false;
    if (this.balance < 0) { // account has been overdrafted
      overdrafted = true;
      this.addTransaction(TransactionType.OVERDRAFT_FEE, -OVERDRAFT_FEE_COST);
    }
    return { newBalance: this.balance, overdrafted };
  }
}
