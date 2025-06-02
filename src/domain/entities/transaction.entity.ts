import { TransactionTypeEnum } from '../enums/transaction-type.enum';
import { BankMoneyValues } from '../interfaces/bank-money/bank-money.interface';

export class TransactionEntity {
  id: string;
  client_id: string;
  type: TransactionTypeEnum;
  value: BankMoneyValues;
  before: BankMoneyValues;
  after: BankMoneyValues;
  created_at: string;
  updated_at: string;
  description?: string;
}
