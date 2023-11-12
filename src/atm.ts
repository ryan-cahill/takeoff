import dayjs from 'dayjs';
import { Account, OVERDRAFT_FEE_COST } from './account';

export type TransactionCommandType = 'authorize' | 'withdraw' | 'deposit' | 'balance' | 'history' | 'logout';

export class ATM {
  private balance: number = 10000; // atm starts with $10,000
  private accounts: Account[] = [];
  private currentAccount?: Account;
  private sessionTimer?: NodeJS.Timeout;

  constructor(accounts: Account[] = []) {
    this.accounts = accounts;
  }

  /**
    Process commands sent to the ATM
    @param command is a TransactionCommandType, representing valid commands to be executed
    @param commandParts is a string array of the arguments to the command
    @returns the output from the command if it was run successfully, and an appropriate error if not
  */
  public processTransaction(command: TransactionCommandType, commandParts?: string[]): string {
    if (['withdraw', 'deposit', 'balance', 'history'].includes(command) && !this.currentAccount) {
      return 'Authorization required.';
    }

    let output: string = '';
    if (command === 'authorize' && commandParts?.length === 2) { 
      output = this.authorizeAccount(commandParts[0], commandParts[1]);
    } else if (command === 'withdraw' && commandParts?.length === 1) {
      const withdrawalAmountString = commandParts[0];
      if (isNaN(+withdrawalAmountString)) {
        return 'Invalid command.';
      }
      const withdrawalAmount = parseInt(commandParts[0]);
      if (withdrawalAmount < 0 || withdrawalAmount % 20 !== 0) {
        return 'Withdrawal amount must be a positive multiple of 20'; 
      }

      output = this.withdrawFromAccount(withdrawalAmount); 
    } else if (command === 'deposit' && commandParts?.length === 1) {
      const depositAmountString = commandParts[0];
      if (isNaN(+depositAmountString)) {
        return 'Invalid command.';
      }

      const depositAmount = parseFloat(commandParts[0]);
      if (depositAmount < 0) {
        return 'Deposit amount must be greater than zero.'; 
      }
      output = this.depositToAccount(depositAmount);
    } else if (command === 'balance' && !commandParts?.length) {
      output = this.getAccountBalance();
    } else if (command === 'history' && !commandParts?.length) {
      output = this.getAccountHistory();
    } else if (command === 'logout' && !commandParts?.length) {
      output = this.logoutOfAccount();
    } else {
      output = 'Invalid command.';
    }

    if (this.sessionTimer) {
      clearTimeout(this.sessionTimer);
    }
    this.sessionTimer = setTimeout(
      () => {
        this.currentAccount = undefined;
      }, 1000 * 60 * 2,
    ); // 2 minutes

    return output;
  }

  /**
    Authorize the account with the credentials provided
  */
  private authorizeAccount(accountNumber: string, accountPin: string): string {
    const account = this.accounts.find((account) => account.getNumber() === accountNumber);
    const accountAuthorized = account?.authorize(accountPin);
    this.currentAccount = account;
    return account && accountAuthorized ? `${accountNumber} successfully authorized.` : 'Authorization failed.';
  }

  /**
    Log out of the account, if currently logged in
  */
  private logoutOfAccount(): string {
    const accountNumber = this.currentAccount?.getNumber();
    this.currentAccount = undefined;
    return accountNumber ? `Account ${accountNumber} logged out.` : 'No account is currently authorized.';
  }

  /**
    Get the balance of the current account
  */
  private getAccountBalance(): string {
    return `Current balance: ${this.currentAccount?.getBalance()}`;
  }

  /**
    Get the history of the account in reverse chronological order
  */
  private getAccountHistory(): string {
    const accountHistory = this.currentAccount?.getHistory();
    if (accountHistory?.length) {
      const allAccountHistory: string[] = [];
      for (const transaction of accountHistory || []) {
        const transactionDate = dayjs(transaction.date).format('YYYY-MM-DD');
        const transactionTime = transaction.date.toLocaleTimeString('en-us', { hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' });
        allAccountHistory.push(`${transactionDate} ${transactionTime} ${transaction.amount} ${transaction.remainingBalance}`);
      }
      return allAccountHistory.join('\n');
    } else {
      return 'No history found';
    }
  }

  /**
    Make a deposit to the current account
  */
  private depositToAccount(depositAmount: number): string {
    const newAccountBalance = this.currentAccount?.deposit(depositAmount);
    return `Current balance: ${newAccountBalance}`;
  }

  /**
    Withdraw from the current account if it's possible, potentially subtracting an overdraft fee
  */
  private withdrawFromAccount(expectedWithdrawalAmount: number): string {
    if (this.balance <= 0) {
      return 'Unable to process your withdrawal at this time.';
    } else if (this.currentAccount!.getBalance() < 0) {
      return 'Your account is overdrawn! You may not make withdrawals at this time.';
    }

    let actualWithdrawalAmount = expectedWithdrawalAmount;
    if (this.balance < expectedWithdrawalAmount) {
      actualWithdrawalAmount = this.balance;
    }
    const withdrawalResult = this.currentAccount?.withdraw(actualWithdrawalAmount);
    this.balance -= actualWithdrawalAmount;

    let output: string = '';
    output += `Amount dispensed: $${actualWithdrawalAmount}`;
    output += `\n${withdrawalResult?.overdrafted ? `You have been charged an overdraft fee of $${OVERDRAFT_FEE_COST}. ` : ''}Current balance: ${withdrawalResult?.newBalance}`;
    if (actualWithdrawalAmount < expectedWithdrawalAmount) {
      output += '\nUnable to dispense full amount requested at this time.';
    }
    return output;
  }
}

// TODO: tests
// TODO: test for bogus commands
