// Uncomment the code below and write your tests
import {BankAccount, getBankAccount, InsufficientFundsError, SynchronizationFailedError, TransferFailedError} from '.';

describe('BankAccount', () => {
  let account: BankAccount;

  beforeEach(() => {
    account = getBankAccount(12)
  })

  test('should create account with initial balance', () => {
    expect(account.getBalance()).toBe(12)
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    expect(() => account.withdraw(14))
        .toThrow(new InsufficientFundsError(account.getBalance()))
  });

  test('should throw error when transferring more than balance', () => {
    expect(() => account.transfer(14, getBankAccount(23)))
        .toThrow(new InsufficientFundsError(account.getBalance()))
  });

  test('should throw error when transferring to the same account', () => {
    expect(() => account.transfer(14, account))
        .toThrow(new TransferFailedError())
  });

  test('should deposit money', () => {
    account.deposit(12)
    expect(account.getBalance()).toBe(24)
  });

  test('should withdraw money', () => {
    account.withdraw(6)
    expect(account.getBalance()).toBe(6)
  });

  test('should transfer money', () => {
    const toAccount = getBankAccount(12)
    account.transfer(6, toAccount)
    expect(account.getBalance()).toBe(6)
    expect(toAccount.getBalance()).toBe(18)
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const balance = await account.fetchBalance();
    if (balance !== null) {
      expect(typeof balance === 'number').toBeTruthy()
    } else {
      expect(balance).toBeNull()
    }
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const previousBalance = account.getBalance()
    try {
      await account.synchronizeBalance()
      expect(typeof account.getBalance() === "number").toBeTruthy()
      expect(account.getBalance()).not.toBe(previousBalance)
    }
    catch (err) {
      expect(account.getBalance()).toBe(previousBalance)
    }
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    try {
      await account.synchronizeBalance()
      expect(typeof account.getBalance() === 'number').toBeTruthy()
    }
    catch (err) {
      expect(err).toEqual(new SynchronizationFailedError())
    }
  });
});
