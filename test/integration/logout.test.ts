import { describe, it } from 'mocha';
import { ATM } from '../../src/atm';
import { expect } from 'chai';
import { Account } from '../../src/account';

describe('logout', () => {
  it('logout from an account', () => {
    const accountNumber = '1';
    const accountPin = '1';
    const atm = new ATM([new Account(accountNumber, accountPin, 1)]);
    atm.processTransaction('authorize', [accountNumber, accountPin]);
    const output = atm.processTransaction('logout');

    expect(output).equal(`Account ${accountNumber} logged out.`);
  });

  it('attempt to logout when no account is currently authorized', () => {
    const atm = new ATM();
    const output = atm.processTransaction('logout');

    expect(output).equal('No account is currently authorized.');
  });

  it('test a malformed logout command with an extra part', () => {
    const accountNumber = '1';
    const accountPin = '1';
    const accountBalance = 1;
    const atm = new ATM([new Account(accountNumber, accountPin, accountBalance)]);
    atm.processTransaction('authorize', [accountNumber, accountPin]);
    const output = atm.processTransaction('logout', ['1']);

    expect(output).equal('Invalid command.');
  });
});
