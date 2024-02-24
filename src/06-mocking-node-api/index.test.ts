// Uncomment the code below and write your tests
import { readFileAsynchronously, doStuffByTimeout, doStuffByInterval } from '.'
import path from 'path'
import * as fs from 'fs'
import * as fsPromises from 'fs/promises'

jest.mock('fs', () => {
  return {
    __esModule: true,    //    <----- this __esModule: true is important
    ...jest.requireActual('fs')
  };
});

jest.mock('fs/promises', () => {
  return {
    __esModule: true,    //    <----- this __esModule: true is important
    ...jest.requireActual('fs/promises')
  };
});

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    (jest.spyOn as any)(global, 'setTimeout')
    const timeout = 2000

    const callback = jest.fn();
    doStuffByTimeout(callback, timeout)

    expect(setTimeout).toHaveBeenCalledTimes(1)
    expect(setTimeout).toHaveBeenCalledWith(callback, timeout)
  });

  test('should call callback only after timeout', () => {
    const callback = jest.fn()
    doStuffByTimeout(callback, 2000)
    expect(callback).not.toHaveBeenCalled()

    jest.runAllTimers()
    expect(callback).toHaveBeenCalled()
    expect(callback).toHaveBeenCalledTimes(1)
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    (jest.spyOn as any)(global, 'setInterval')
    const timeout = 2000

    const callback = jest.fn();
    doStuffByInterval(callback, timeout)

    expect(setInterval).toHaveBeenCalledWith(callback, timeout)
  });

  test('should call callback multiple times after multiple intervals', () => {
    const interval = 1000
    const timer = 3000
    const callback = jest.fn()
    doStuffByInterval(callback, interval)

    jest.advanceTimersByTime(timer)

    expect(callback).toHaveBeenCalledTimes(timer / interval)
  })
});

describe('readFileAsynchronously', () => {

  test('should call join with pathToFile', async () => {
    const pathToFile = path.join('path', 'file')

    const joinSpy = (jest.spyOn as any)(path, 'join')
    await readFileAsynchronously(pathToFile)
    expect(joinSpy.mock.calls[0].includes(pathToFile)).toBeTruthy()
  });

  test('should return null if file does not exist', async () => {
    (jest.spyOn as any)(fs, 'existsSync').mockImplementation(() => {
      return null
    })

    const value = await readFileAsynchronously(path.join('file.txt'))
    expect(value).toBeNull()
  });

  test('should return file content if file exists', async () => {
    (jest.spyOn as any)(fs, 'existsSync').mockImplementation(() => {
      return true
    });
    (jest.spyOn as any)(fsPromises, 'readFile').mockImplementation(() => {
      return 'dummy file content'
    });

    const value = await readFileAsynchronously(path.join('some_file'))
    expect(value).toBe('dummy file content')
  });
});
