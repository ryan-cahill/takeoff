import { createInterface } from 'readline';
import { ATM, TransactionCommandType } from './atm';
import { readFileSync } from 'fs';
import path from 'path';
import { Account } from './account';

const csvAccountData = readFileSync(path.join(__dirname, '..', 'accounts.csv'));
const accountRows = csvAccountData.toString().split('\n');
accountRows.shift(); // remove the first element of the list, which is the csv header
accountRows.pop(); // the last element of the csv is a newline, which has no data, so ignore it
const accounts = [];
for (const accountRow of accountRows) {
  const [id, pin, balance] = accountRow.split(',');
  accounts.push(new Account(id, pin, parseFloat(balance)));
}
const atm = new ATM(accounts);

const readLine = createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'Takeoff Bank ATM> ',
});

readLine.prompt();

readLine
  .on('line', (line: string) => {
    const commandParts = line.split(' ');
    const command = commandParts[0];

    if (command === 'end') { // signal given to end the program
      readLine.close();
    }

    if (['withdraw', 'deposit', 'balance', 'history', 'authorize', 'logout'].includes(command)) { // filter out bogus commands
      commandParts.shift(); // remove actual command from command parts
      console.log(atm.processTransaction(command as TransactionCommandType, commandParts));
    } else {
      console.log('Invalid command.');
    }

    readLine.prompt();
  })
  .on('close', () => {
    console.log('Thanks for visiting the Takeoff Bank ATM.');
    process.exit(0);
  });
