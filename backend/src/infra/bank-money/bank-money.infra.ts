import BigNumber from 'bignumber.js';
import {
  BankMoneyValues,
  IBankMoney
} from 'src/domain/interfaces/bank-money/bank-money.interface';

export class BankMoney implements IBankMoney {
  private readonly value: BigNumber;

  private constructor(value: BigNumber) {
    this.value = value;
  }

  static create(value: BankMoneyValues): BankMoney {
    if (value instanceof BankMoney) return new BankMoney(value.value);
    if (value instanceof BigNumber) return new BankMoney(value);
    return new BankMoney(new BigNumber(value as string | number));
  }

  public add(value: BankMoneyValues): BankMoney {
    return new BankMoney(this.value.plus(this.normalize(value)));
  }

  public sub(value: BankMoneyValues): BankMoney {
    return new BankMoney(this.value.minus(this.normalize(value)));
  }

  public lt(value: BankMoneyValues): boolean {
    return this.value.lt(this.normalize(value));
  }

  public lte(value: BankMoneyValues): boolean {
    return this.value.lte(this.normalize(value));
  }

  public gt(value: BankMoneyValues): boolean {
    return this.value.gt(this.normalize(value));
  }

  public times(value: BankMoneyValues): BankMoney {
    return new BankMoney(this.value.multipliedBy(this.normalize(value)));
  }

  public fixed(decimalPlaces: number): BankMoney {
    return new BankMoney(new BigNumber(this.value.toFixed(decimalPlaces)));
  }

  public toString(): string {
    return this.value.toString();
  }

  private normalize(value: BankMoneyValues): BigNumber {
    if (value instanceof BankMoney) return value.value;
    if (value instanceof BigNumber) return value;
    return new BigNumber(value as string | number);
  }
}
