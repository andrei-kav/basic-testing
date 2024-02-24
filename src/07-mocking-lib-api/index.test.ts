// Uncomment the code below and write your tests
import { throttledGetDataFromApi } from './index';
import axios from "axios";

jest.mock('axios', () => {
  const mockInstance = { get: () => Promise.resolve({data: {name: 'Andrei'}}) }
  return {
    create: () => mockInstance,
  };
});

jest.mock('lodash', () => ({
  throttle: (fn: () => unknown) => fn,
}));

describe('throttledGetDataFromApi', () => {

  test('should create instance with provided base url', async () => {
    const createInstanceSpy = (jest.spyOn as any)(axios, 'create');
    const baseURL = 'https://jsonplaceholder.typicode.com'
    await throttledGetDataFromApi('')
    expect(createInstanceSpy).toHaveBeenCalledWith({baseURL})
  });

  test('should perform request to correct provided url', async () => {
    const getSpy = (jest.spyOn as any)(axios.create(), 'get')
    await throttledGetDataFromApi('request')
    expect(getSpy).toHaveBeenCalled()
    expect(getSpy).toHaveBeenCalledWith('request')
  });

  test('should return response data', async () => {
    const res = await throttledGetDataFromApi('request')
    expect(res).toEqual({name: 'Andrei'})
  });

});
