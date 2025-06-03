import BigNumber from 'bignumber.js';

export type BankMoneyValues = IBankMoney | BigNumber | string | number;

export interface IBankMoney {
  add(value: BankMoneyValues): IBankMoney;
  sub(value: BankMoneyValues): IBankMoney;
  lt(value: BankMoneyValues): boolean;
  lte(value: BankMoneyValues): boolean;
  gt(value: BankMoneyValues): boolean;
  times(value: BankMoneyValues): IBankMoney;
  fixed(decimalPlaces: number): IBankMoney;
  toString(): string;
}
