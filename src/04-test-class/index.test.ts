// Uncomment the code below and write your tests
import {BankAccount, getBankAccount, InsufficientFundsError, SynchronizationFailedError, TransferFailedError} from '.';
import * as lodash from 'lodash'

jest.mock('lodash', () => {
  return {
    __esModule: true,    //    <----- this __esModule: true is important
    ...jest.requireActual('lodash')
  };
});

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
    (jest.spyOn as any)(lodash, 'random').mockImplementation(() => 67)
    const balance = await account.fetchBalance()
    expect(typeof balance === 'number').toBeTruthy()
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const newBalance = 67;
    (jest.spyOn as any)(lodash, 'random').mockImplementation(() => newBalance)
    const previousBalance = account.getBalance()
    await account.synchronizeBalance()
    expect(account.getBalance()).toBe(newBalance)
    expect(previousBalance).not.toBe(newBalance)
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    (jest.spyOn as any)(lodash, 'random').mockImplementation(() => 0);
    await expect(account.synchronizeBalance()).rejects.toThrow(new SynchronizationFailedError())
  });
});
