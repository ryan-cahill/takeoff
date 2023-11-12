import { describe, it } from 'mocha';
import { ATM } from '../../src/atm';
import { expect } from 'chai';
import { Account } from '../../src/account';
import sinon from 'sinon';

describe('authorize', () => {
  it('authorize a user with the correct credentials', () => {
    const accountNumber = '1';
    const accountPin = '1';
    const atm = new ATM([new Account(accountNumber, accountPin, 1)]);
    const output = atm.processTransaction('authorize', [accountNumber, accountPin]);

    expect(output).equal(`${accountNumber} successfully authorized.`);
  });

  it('an authorized user will be logged out automatically after being idle for 2 minutes or more', () => {
    const clock = sinon.useFakeTimers(Date.now());
    const accountNumber = '1';
    const accountPin = '1';
    const accountBalance = 1;
    const atm = new ATM([new Account(accountNumber, accountPin, accountBalance)]);
    const authorizeOutput = atm.processTransaction('authorize', [accountNumber, accountPin]);
    expect(authorizeOutput).equal(`${accountNumber} successfully authorized.`);
    const balanceOutput = atm.processTransaction('balance');
    expect(balanceOutput).equal(`Current balance: ${accountBalance}`);
    clock.tick(1000 * 60 * 3); // pass three minutes when the user should be logged out automatically
    const unauthorizedOutput = atm.processTransaction('balance');
    expect(unauthorizedOutput).equal('Authorization required.');
    clock.restore();
  });

  it('attempt to authorize a user with incorrect credentials', () => {
    const atm = new ATM();
    const output = atm.processTransaction('authorize', ['1', '1']);

    expect(output).equal('Authorization failed.');
  });

  it('test a malformed authorize command without a pin', () => {
    const accountNumber = '1';
    const accountPin = '1';
    const accountBalance = 1;
    const atm = new ATM([new Account(accountNumber, accountPin, accountBalance)]);
    const output = atm.processTransaction('authorize', ['1']);

    expect(output).equal('Invalid command.');
  });

  it('test a malformed authorize command with an extra part', () => {
    const accountNumber = '1';
    const accountPin = '1';
    const accountBalance = 1;
    const atm = new ATM([new Account(accountNumber, accountPin, accountBalance)]);
    const output = atm.processTransaction('authorize', ['1', '1', '1']);

    expect(output).equal('Invalid command.');
  });
});
