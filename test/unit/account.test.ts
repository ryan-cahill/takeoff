import { expect } from "chai";
import { Account, OVERDRAFT_FEE_COST } from "../../src/account";

describe('account', () => {
  it('deposit to an account', () => {
    const accountNumber = '1';
    const accountPin = '1';
    const accountBalance = 1;
    const account = new Account(accountNumber, accountPin, accountBalance);
    const depositAmount = 100;
    account.deposit(depositAmount);
    
    expect(account.getBalance()).equal(accountBalance + depositAmount);
  }); 

  it('withdraw from an account', () => {
    const accountNumber = '1';
    const accountPin = '1';
    const accountBalance = 100;
    const account = new Account(accountNumber, accountPin, accountBalance);
    const withdrawalAmount = 10;
    account.withdraw(withdrawalAmount);
    
    expect(account.getBalance()).equal(accountBalance - withdrawalAmount);
  }); 

  it('withdraw from an account and overdraft', () => {
    const accountNumber = '1';
    const accountPin = '1';
    const accountBalance = 100;
    const account = new Account(accountNumber, accountPin, accountBalance);
    const withdrawalAmount = 1000;
    account.withdraw(withdrawalAmount);
    
    expect(account.getBalance()).equal(accountBalance - withdrawalAmount - OVERDRAFT_FEE_COST);
  }); 

  it('a deposit adds one entry to the account history', () => {
    const accountNumber = '1';
    const accountPin = '1';
    const accountBalance = 1;
    const account = new Account(accountNumber, accountPin, accountBalance);
    const historyBeforeLength = account.getHistory().length;
    const depositAmount = 100;
    account.deposit(depositAmount);
    const historyAfterLength = account.getHistory().length;
    
    expect(historyAfterLength).equal(historyBeforeLength + 1);
  }); 

  it('a withdrawal adds one entry to the account history', () => {
    const accountNumber = '1';
    const accountPin = '1';
    const accountBalance = 1000;
    const account = new Account(accountNumber, accountPin, accountBalance);
    const historyBeforeLength = account.getHistory().length;
    const withdrawalAmount = 1000;
    account.withdraw(withdrawalAmount);
    const historyAfterLength = account.getHistory().length;
    
    expect(historyAfterLength).equal(historyBeforeLength + 1);
  }); 

  it('a withdrawal with an overdraft adds two entries to the account history', () => {
    const accountNumber = '1';
    const accountPin = '1';
    const accountBalance = 1;
    const account = new Account(accountNumber, accountPin, accountBalance);
    const historyBeforeLength = account.getHistory().length;
    const withdrawalAmount = 1000;
    account.withdraw(withdrawalAmount);
    const historyAfterLength = account.getHistory().length;
    
    expect(historyAfterLength).equal(historyBeforeLength + 2);
  }); 

  it('check the account balance', () => {
    const accountNumber = '1';
    const accountPin = '1';
    const accountBalance = 1;
    const account = new Account(accountNumber, accountPin, accountBalance);

    expect(account.getBalance()).equal(accountBalance);
  });

  it('get the account number', () => {
    const accountNumber = '1';
    const accountPin = '1';
    const accountBalance = 1;
    const account = new Account(accountNumber, accountPin, accountBalance);

    expect(account.getNumber()).equal(accountNumber);
  });

  it('authorize with the account pin', () => {
    const accountNumber = '1';
    const accountPin = '1';
    const accountBalance = 1;
    const account = new Account(accountNumber, accountPin, accountBalance);

    expect(account.authorize(accountPin)).true;
  });
}); 
