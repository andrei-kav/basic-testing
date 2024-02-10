// Uncomment the code below and write your tests
import {simpleCalculator, Action} from './index';

describe.only('simpleCalculator tests', () => {
  test('should add two numbers', () => {
    const input = {a: 3, b: 6, action: Action.Add}
    expect(simpleCalculator(input)).toBe(9)
  });

  test('should subtract two numbers', () => {
    const input = {a: 6, b: 3, action: Action.Subtract}
    expect(simpleCalculator(input)).toBe(3)
  });

  test('should multiply two numbers', () => {
    const input = {a: 6, b: 3, action: Action.Multiply}
    expect(simpleCalculator(input)).toBe(18)
  });

  test('should divide two numbers', () => {
    const input = {a: 6, b: 3, action: Action.Divide}
    expect(simpleCalculator(input)).toBe(2)
  });

  test('should exponentiate two numbers', () => {
    const input = {a: 2, b: 3, action: Action.Exponentiate}
    expect(simpleCalculator(input)).toBe(8)
  });

  test('should return null for invalid action', () => {
    [
      {a: 2, b: 3, action: 23},
      {a: 2, b: 3, action: 'invalidAction'},
      {a: 2, b: 3, action: ['invalidAction']}
    ].forEach((input: any) => {
      expect(simpleCalculator(input)).toBe(null)
    })
  });

  test('should return null for invalid arguments', () => {
    [
      {a: '2', b: 3, action: Action.Add},
      {a: 2, b: '3', action: Action.Add},
      {a: 2, b: ['3'], action: Action.Add}
    ].forEach((input: any) => {
      expect(simpleCalculator(input)).toBe(null)
    })
  });
});
