import { describe, it } from 'mocha';
import { ATM } from '../../src/atm';
import { expect } from 'chai';
import { Account, OVERDRAFT_FEE_COST } from '../../src/account';

describe('withdraw', () => {
  it('withdraw all of the money from an account', () => {
    const accountNumber = '1';
    const accountPin = '1';
    const accountBalance = 100;
    const atm = new ATM([new Account(accountNumber, accountPin, accountBalance)]);
    atm.processTransaction('authorize', [accountNumber, accountPin]);
    const withdrawalAmount = 100;
    const output = atm.processTransaction('withdraw', [withdrawalAmount.toString()]);

    expect(output).equal(`Amount dispensed: $${withdrawalAmount}\nCurrent balance: ${accountBalance - withdrawalAmount}`);
  });

  it('attempt to withdraw a negative number of dollars', () => {
    const accountNumber = '1';
    const accountPin = '1';
    const accountBalance = 100;
    const atm = new ATM([new Account(accountNumber, accountPin, accountBalance)]);
    atm.processTransaction('authorize', [accountNumber, accountPin]);
    const output = atm.processTransaction('withdraw', ['-100']);

    expect(output).equal('Withdrawal amount must be a positive multiple of 20');
  });

  it('attempt to withdraw a number of dollars not divisible by 20', () => {
    const accountNumber = '1';
    const accountPin = '1';
    const accountBalance = 100;
    const atm = new ATM([new Account(accountNumber, accountPin, accountBalance)]);
    atm.processTransaction('authorize', [accountNumber, accountPin]);
    const output = atm.processTransaction('withdraw', ['12']);

    expect(output).equal('Withdrawal amount must be a positive multiple of 20');
  });

  it('withdraw some of the money from an account', () => {
    const accountNumber = '1';
    const accountPin = '1';
    const accountBalance = 100;
    const atm = new ATM([new Account(accountNumber, accountPin, accountBalance)]);
    atm.processTransaction('authorize', [accountNumber, accountPin]);
    const withdrawalAmount = 40;
    const output = atm.processTransaction('withdraw', [withdrawalAmount.toString()]);

    expect(output).equal(`Amount dispensed: $${withdrawalAmount}\nCurrent balance: ${accountBalance - withdrawalAmount}`);
  });

  it('overdraft from an account', () => {
    const accountNumber = '1';
    const accountPin = '1';
    const accountBalance = 100;
    const atm = new ATM([new Account(accountNumber, accountPin, accountBalance)]);
    atm.processTransaction('authorize', [accountNumber, accountPin]);
    const withdrawalAmount = 200;
    const output = atm.processTransaction('withdraw', [withdrawalAmount.toString()]);

    expect(output).equal(`Amount dispensed: $${withdrawalAmount}\nYou have been charged an overdraft fee of $${OVERDRAFT_FEE_COST}. Current balance: ${accountBalance - withdrawalAmount - OVERDRAFT_FEE_COST}`);
  });

  it('attempt to withdraw from an account which has already been overdrafted', () => {
    const accountNumber = '1';
    const accountPin = '1';
    const accountBalance = 100;
    const atm = new ATM([new Account(accountNumber, accountPin, accountBalance)]);
    atm.processTransaction('authorize', [accountNumber, accountPin]);
    const withdrawalAmount = '200';
    atm.processTransaction('withdraw', [withdrawalAmount]);
    const output = atm.processTransaction('withdraw', [withdrawalAmount]);

    expect(output).equal('Your account is overdrawn! You may not make withdrawals at this time.');
  });

  it('withdraw all of the money from the machine when there is still some left', () => {
    const accountNumber = '1';
    const accountPin = '1';
    const accountBalance = 100000;
    const atm = new ATM([new Account(accountNumber, accountPin, accountBalance)]);
    atm.processTransaction('authorize', [accountNumber, accountPin]);
    const withdrawalAmount = '10020';
    const output = atm.processTransaction('withdraw', [withdrawalAmount]);
    const atmTotalCash = 10000;

    expect(output).equal(`Amount dispensed: $${atmTotalCash}\nCurrent balance: ${accountBalance - atmTotalCash}\nUnable to dispense full amount requested at this time.`);
  });

  it('withdraw all of the money from the machine when there is still some left and overdraft', () => {
    const accountNumber = '1';
    const accountPin = '1';
    const accountBalance = 1000;
    const atm = new ATM([new Account(accountNumber, accountPin, accountBalance)]);
    atm.processTransaction('authorize', [accountNumber, accountPin]);
    const withdrawalAmount = '10020';
    const output = atm.processTransaction('withdraw', [withdrawalAmount]);
    const atmTotalCash = 10000;

    expect(output).equal(`Amount dispensed: $${atmTotalCash}\nYou have been charged an overdraft fee of $5. Current balance: ${accountBalance - atmTotalCash - OVERDRAFT_FEE_COST}\nUnable to dispense full amount requested at this time.`);
  });

  it('withdraw from the machine when there is none left', () => {
    const accountNumber = '1';
    const accountPin = '1';
    const accountBalance = 100000;
    const atm = new ATM([new Account(accountNumber, accountPin, accountBalance)]);
    atm.processTransaction('authorize', [accountNumber, accountPin]);
    const withdrawalAmount = '10020';
    atm.processTransaction('withdraw', [withdrawalAmount]);
    const output = atm.processTransaction('withdraw', [withdrawalAmount]);

    expect(output).equal('Unable to process your withdrawal at this time.');
  });

  it('attempt to make a withdrawal when no account is currently authorized', () => {
    const atm = new ATM();
    const output = atm.processTransaction('withdraw', ['1']);

    expect(output).equal('Authorization required.');
  });

  it('test a malformed withdrawal command that does not use a number', () => {
    const accountNumber = '1';
    const accountPin = '1';
    const accountBalance = 1;
    const atm = new ATM([new Account(accountNumber, accountPin, accountBalance)]);
    atm.processTransaction('authorize', [accountNumber, accountPin]);
    const output = atm.processTransaction('withdraw', ['nonsense']);

    expect(output).equal('Invalid command.');
  });

  it('test a malformed withdrawal command with an extra part', () => {
    const accountNumber = '1';
    const accountPin = '1';
    const accountBalance = 1;
    const atm = new ATM([new Account(accountNumber, accountPin, accountBalance)]);
    atm.processTransaction('authorize', [accountNumber, accountPin]);
    const output = atm.processTransaction('deposit', ['1', '1']);

    expect(output).equal('Invalid command.');
  });
});
