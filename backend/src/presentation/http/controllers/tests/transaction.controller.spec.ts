import { Test, TestingModule } from '@nestjs/testing';
import { TransactionController } from '../transaction.controller';
import { TransactionTypeEnum } from 'src/domain/enums/transaction-type.enum';
import { BankMoney } from 'src/infra/bank-money/bank-money.infra';

describe('TransactionController', () => {
  let controller: TransactionController;

  const mockTransaction = {
    id: '66fbf838-0939-494a-b361-cb97f0a15551',
    client_id: '66fbf838-0939-494a-b361-cb97f0a15552',
    type: TransactionTypeEnum.DEPOSIT,
    value: BankMoney.create('100').fixed(2).toString(),
    before: BankMoney.create('0').fixed(2).toString(),
    after: BankMoney.create('100').fixed(2).toString(),
    description: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const createTransactionUseCase = {
    execute: jest.fn().mockResolvedValue(mockTransaction)
  };

  const listTransactionUseCase = {
    execute: jest.fn().mockResolvedValue([mockTransaction])
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [
        {
          provide: 'CreateTransactionUseCase',
          useValue: createTransactionUseCase
        },
        { provide: 'ListTransactionUseCase', useValue: listTransactionUseCase }
      ]
    }).compile();

    controller = module.get<TransactionController>(TransactionController);
  });

  it('should deposit into client account', async () => {
    const param = { client_id: mockTransaction.client_id };
    const body = { value: mockTransaction.value };

    const result = await controller.deposit(param, body);

    expect(result.after).toBe(mockTransaction.after);
    expect(createTransactionUseCase.execute).toHaveBeenCalledWith({
      client_id: param.client_id,
      value: body.value,
      type: TransactionTypeEnum.DEPOSIT
    });
  });

  it('should withdraw from client account', async () => {
    const param = { client_id: mockTransaction.client_id };
    const body = { value: mockTransaction.value };

    const result = await controller.withdrawal(param, body);

    expect(result.value).toBe(mockTransaction.value);
    expect(createTransactionUseCase.execute).toHaveBeenCalledWith({
      client_id: param.client_id,
      value: body.value,
      type: TransactionTypeEnum.WITHDRAWAL
    });
  });

  it('should list transactions for a client', async () => {
    const param = { client_id: mockTransaction.client_id };

    const result = await controller.listTransactions(param);

    expect(Array.isArray(result)).toBe(true);
    expect(result[0].id).toBe(mockTransaction.id);
    expect(listTransactionUseCase.execute).toHaveBeenCalledWith(
      param.client_id
    );
  });
});
