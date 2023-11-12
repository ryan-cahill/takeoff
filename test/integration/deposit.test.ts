import { describe, it } from 'mocha';
import { ATM } from '../../src/atm';
import { expect } from 'chai';
import { Account } from '../../src/account';

describe('deposit', () => {
  it('deposit to an account', () => {
    const accountNumber = '1';
    const accountPin = '1';
    const accountBalance = 1;
    const atm = new ATM([new Account(accountNumber, accountPin, accountBalance)]);
    atm.processTransaction('authorize', [accountNumber, accountPin]);
    const depositAmount = 100;
    const output = atm.processTransaction('deposit', [depositAmount.toString()]);

    expect(output).equal(`Current balance: ${accountBalance + depositAmount}`);
  });

  it('attempt to deposit a negative number of dollars', () => {
    const accountNumber = '1';
    const accountPin = '1';
    const accountBalance = 1;
    const atm = new ATM([new Account(accountNumber, accountPin, accountBalance)]);
    atm.processTransaction('authorize', [accountNumber, accountPin]);
    const output = atm.processTransaction('deposit', ['-100']);

    expect(output).equal('Deposit amount must be greater than zero.');
  });

  it('attempt to make a deposit when no account is currently authorized', () => {
    const atm = new ATM();
    const output = atm.processTransaction('deposit', ['1']);

    expect(output).equal('Authorization required.');
  });

  it('test a malformed deposit command that does not use a number', () => {
    const accountNumber = '1';
    const accountPin = '1';
    const accountBalance = 1;
    const atm = new ATM([new Account(accountNumber, accountPin, accountBalance)]);
    atm.processTransaction('authorize', [accountNumber, accountPin]);
    const output = atm.processTransaction('deposit', ['nonsense']);

    expect(output).equal('Invalid command.');
  });

  it('test a malformed deposit command with an extra part', () => {
    const accountNumber = '1';
    const accountPin = '1';
    const accountBalance = 1;
    const atm = new ATM([new Account(accountNumber, accountPin, accountBalance)]);
    atm.processTransaction('authorize', [accountNumber, accountPin]);
    const output = atm.processTransaction('deposit', ['1', '1']);

    expect(output).equal('Invalid command.');
  });
});
