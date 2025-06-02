import BigNumber from 'bignumber.js';
import { BankMoney } from '../bank-money.infra';

describe('infra :: BankMoney', () => {
  it('should create instance from number, string, BigNumber or BankMoney', () => {
    expect(BankMoney.create(10).toString()).toBe('10');
    expect(BankMoney.create('20.5').toString()).toBe('20.5');
    expect(BankMoney.create(new BigNumber(30)).toString()).toBe('30');
    expect(BankMoney.create(BankMoney.create(40)).toString()).toBe('40');
  });

  it('should add two values correctly', () => {
    const money = BankMoney.create(10);
    const result = money.add(5);
    expect(result.toString()).toBe('15');
  });

  it('should subtract two values correctly', () => {
    const money = BankMoney.create(10);
    const result = money.sub(4);
    expect(result.toString()).toBe('6');
  });

  it('should compare lt correctly', () => {
    const a = BankMoney.create(5);
    const b = BankMoney.create(10);
    expect(a.lt(b)).toBe(true);
    expect(b.lt(a)).toBe(false);
  });

  it('should compare gt correctly', () => {
    const a = BankMoney.create(5);
    const b = BankMoney.create(10);
    expect(a.gt(b)).toBe(false);
    expect(b.gt(a)).toBe(true);
  });

  it('should multiply values correctly', () => {
    const money = BankMoney.create(10);
    const result = money.times(2.5);
    expect(result.toString()).toBe('25');
  });

  it('should fix decimal places correctly', () => {
    const money = BankMoney.create('10.56789');
    const result = money.fixed(2);
    expect(result.toString()).toBe('10.57');
  });

  it('should chain operations safely', () => {
    const result = BankMoney.create(10).add(5).sub(2).times(2).fixed(2);
    expect(result.toString()).toBe('26');
  });
});
