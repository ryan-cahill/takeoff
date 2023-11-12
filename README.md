# Takeoff ATM

This program simulates the functions of an ATM on the command line.

## Dependencies

The following is required before running the application:

* [Install Node.js](https://nodejs.org/en/learn/getting-started/how-to-install-nodejs) version 18 or higher. Installation through [`nvm`](https://github.com/nvm-sh/nvm#intro) is recommended.
* [Install npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm). If you've already installed Node.js with `nvm`, a version of npm is already installed.
* In the root of the project directory, run `npm install` in order to install the project's dependencies.

## Running the program

Run the program by running the command `npm run start` in the root of the project directory.

## Available commands

Once the program has been started, the following commands will be available to interfact with the ATM.

### `authorize`

Authorizes an account locally until the user is logged out. If there is no activity for 2 minutes, the user will be automatically logged out the account.

#### Usage: `authorize <account_id> <pin>`

A successful authorization returns:

`<account_id> successfully authorized.`

An unsuccessful authorization returns:

`Authorization failed.`

Attempts to access any other commands, with the exception of logout and end, without an active authorization results in:

`Authorization required.`

### `withdraw`

Removes value from the authorized account. The machine only contains $20 bills, so the withdrawal amount must be a multiple of 20.

#### Usage: `withdraw <value>`

If account has not been overdrawn, returns balance after withdrawal in the format:

```
Amount dispensed: $<x>
Current balance: <balance>
```

If the account has been overdrawn with this transaction, removes a further $5 from their account, and returns:

```
Amount dispensed: $<x>
You have been charged an overdraft fee of $5. Current balance: <balance>
```

This $5 fee shows up in the transaction history as a separate transaction that occurs immediately after the withdrawal transaction. The machine can’t dispense more money than it contains. If in the above two scenarios the machine contains less money than was
requested, the withdrawal amount will be adjusted to be the amount in the machine and the following will be prepended to the return value:

`Unable to dispense full amount requested at this time.`

If instead there is no money in the machine, the return value will be this and only this:

`Unable to process your withdrawal at this time.`

If the account is already overdrawn, no checks against the available money in the machine will be performed, the withdrawal will not be processed, and the ATM will return only this:

`Your account is overdrawn! You may not make withdrawals at this time.`

### `deposit`

Adds value to the authorized account. The deposited amount does not need to be a multiple of 20, nor does it have to be a whole dollar amount; for example, deposit 10.36 is valid. Depositing money does not add money to the ATM itself.

#### Usage: `deposit <value>`

Returns the account’s balance after deposit is made in the format:

`Current balance: <balance>`

### `balance`

Returns the account’s current balance.

#### Usage: `balance`

Returns the account’s balance in the format:

`Current balance: <balance>`

### `history`

Returns the account’s transaction history.

#### Usage: `history`

If there is no history, returns:

`No history found`

Otherwise, returns the transaction history in reverse chronological order (most recent transaction first) in the format:

`<date> <time> <amount> <balance after transaction>`

For example:

```
2020-02-04 13:04:22 -20.00 140.67
2020-02-04 13:04:01 60.44 160.67
2020-02-04 13:03:49 35.00 100.23
```

### `logout`

Deactivates the currently authorized account.

#### Usage: `logout`

If an account is currently authorized, returns:

`Account <account_id> logged out.`

Otherwise, returns:

`No account is currently authorized.`

### `end`

Shuts down the server.

#### Usage: `end`

Returns nothing, and ends the program

## Running tests

Unit and integration tests can be started by running the command `npm test` in the root of the project directory.
