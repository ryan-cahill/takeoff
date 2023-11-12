import { describe, it } from 'mocha';
import { ATM } from '../../src/atm';
import { expect } from 'chai';
import { Account } from '../../src/account';

describe('balance', () => {
  it('get a balance from an account', () => {
    const accountNumber = '1';
    const accountPin = '1';
    const accountBalance = 1;
    const atm = new ATM([new Account(accountNumber, accountPin, accountBalance)]);
    atm.processTransaction('authorize', [accountNumber, accountPin]);
    const output = atm.processTransaction('balance');

    expect(output).equal(`Current balance: ${accountBalance}`);
  });

  it('attempt to get a balance when no account is currently authorized', () => {
    const atm = new ATM();
    const output = atm.processTransaction('balance');

    expect(output).equal('Authorization required.');
  });

  it('test a malformed balance command with an extra part', () => {
    const accountNumber = '1';
    const accountPin = '1';
    const accountBalance = 1;
    const atm = new ATM([new Account(accountNumber, accountPin, accountBalance)]);
    atm.processTransaction('authorize', [accountNumber, accountPin]);
    const output = atm.processTransaction('balance', ['1']);

    expect(output).equal('Invalid command.');
  });
});
