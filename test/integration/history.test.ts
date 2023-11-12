import { describe, it } from 'mocha';
import { ATM } from '../../src/atm';
import { expect } from 'chai';
import { Account } from '../../src/account';
import * as sinon from 'sinon';

describe('history', () => {
  it('get history from an account with a single transaction', () => {
    const accountNumber = '1';
    const accountPin = '1';
    const accountBalance = 1;
    const atm = new ATM([new Account(accountNumber, accountPin, accountBalance)]);
    atm.processTransaction('authorize', [accountNumber, accountPin]);
    const depositAmount = 100;
    atm.processTransaction('deposit', [depositAmount.toString()]);
    const output = atm.processTransaction('history');

    expect(output).includes(`${depositAmount} ${accountBalance + depositAmount}`);
  });

  it('get history from an account with multiple transactions', () => {
    const accountNumber = '1';
    const accountPin = '1';
    const accountBalance = 1;
    const atm = new ATM([new Account(accountNumber, accountPin, accountBalance)]);
    atm.processTransaction('authorize', [accountNumber, accountPin]);
    const depositAmount = 100;
    atm.processTransaction('deposit', [depositAmount.toString()]);
    const withdrawalAmount = 60;
    atm.processTransaction('withdraw', [withdrawalAmount.toString()]);
    const output = atm.processTransaction('history');

    const [secondTransaction, firstTransaction] = output.split('\n');
    expect(firstTransaction).includes(`${depositAmount} ${accountBalance + depositAmount}`);
    expect(secondTransaction).includes(`${withdrawalAmount} ${accountBalance + depositAmount - withdrawalAmount}`);
  });

  it('transactions are listed in reverse chronological order', async () => {
    const clock = sinon.useFakeTimers(Date.now());
    const accountNumber = '1';
    const accountPin = '1';
    const accountBalance = 1;
    const atm = new ATM([new Account(accountNumber, accountPin, accountBalance)]);
    atm.processTransaction('authorize', [accountNumber, accountPin]);
    const depositAmount = 100;
    atm.processTransaction('deposit', [depositAmount.toString()]);
    clock.tick(1000);
    const withdrawalAmount = 60;
    atm.processTransaction('withdraw', [withdrawalAmount.toString()]);
    const output = atm.processTransaction('history');

    const [secondTransaction, firstTransaction] = output.split('\n');
    const secondTransactionSplit = secondTransaction.split(' ');
    const secondTransactionTime = new Date(`${secondTransactionSplit[0]} ${secondTransactionSplit[1]}`);
    const firstTransactionSplit = firstTransaction.split(' ');
    const firstTransactionTime = new Date(`${firstTransactionSplit[0]} ${firstTransactionSplit[1]}`);
    console.log(firstTransaction)
    console.log(secondTransaction)
    expect(secondTransactionTime).to.be.greaterThan(firstTransactionTime);
    clock.restore();
  });

  it('attempt to check account history when no account is currently authorized', () => {
    const atm = new ATM();
    const output = atm.processTransaction('history');

    expect(output).equal('Authorization required.');
  });

  it('test a malformed history command with an extra part', () => {
    const accountNumber = '1';
    const accountPin = '1';
    const accountBalance = 1;
    const atm = new ATM([new Account(accountNumber, accountPin, accountBalance)]);
    atm.processTransaction('authorize', [accountNumber, accountPin]);
    const output = atm.processTransaction('history', ['1']);

    expect(output).equal('Invalid command.');
  });
});
