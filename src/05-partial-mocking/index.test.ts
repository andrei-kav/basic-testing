// Uncomment the code below and write your tests
import {mockOne, mockTwo, mockThree, unmockedFunction} from './index';
import Mock = jest.Mock;

jest.mock('./index', () => {
  const originalModule = jest.requireActual<typeof import('./index')>('./index');
  return {
    __esModule: true,
    ...originalModule,
    mockOne: jest.fn(() => {}),
    mockTwo: jest.fn(() => '2'),
    mockThree: jest.fn(() => '3')
  }
});

describe('partial mocking', () => {
  let logSpy: Mock

  afterAll(() => {
    jest.unmock('./index');
  });

  beforeEach(() => {
    logSpy = (jest.spyOn as any)(console, 'log')
  })

  afterEach(() => {
    logSpy.mockRestore()
  })

  test('mockOne, mockTwo, mockThree should not log into console', () => {
    mockOne()
    mockTwo()
    mockThree()

    expect(logSpy).not.toHaveBeenCalled()
  });

  test('unmockedFunction should log into console', () => {
    unmockedFunction()
    expect(logSpy).toHaveBeenCalled()
  });
});
