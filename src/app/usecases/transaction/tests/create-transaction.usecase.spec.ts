import { TransactionTypeEnum } from 'src/domain/enums/transaction-type.enum';
import { CreateTransactionUseCase } from '../create-transaction.usecase';
import { BankMoney } from 'src/infra/bank-money/bank-money.infra';

// Mocks
const mockClientRepository = {
  getBy: jest.fn()
};

const mockTransactionRepository = {
  create: jest.fn()
};

const mockException = {
  badRequest: jest.fn((message: string) => new Error(message)),
  notFound: jest.fn((message: string) => new Error(message))
};

const mockLogger = {
  info: jest.fn()
};

const makeUseCase = () =>
  new CreateTransactionUseCase(
    mockClientRepository as any,
    mockTransactionRepository as any,
    mockException as any,
    mockLogger as any
  );

describe('app :: usecases :: transaction :: CreateTransactionUseCase', () => {
  const baseParams = {
    client_id: 'uuid',
    type: TransactionTypeEnum.DEPOSIT,
    value: '100.00'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw if value is less than 0', async () => {
    const useCase = makeUseCase();

    await expect(
      useCase.execute({ ...baseParams, value: '-1' })
    ).rejects.toThrow('Insufficient value for valid transaction');

    expect(mockException.badRequest).toHaveBeenCalledWith(
      'Insufficient value for valid transaction'
    );
  });

  it('should throw if client is not found', async () => {
    mockClientRepository.getBy.mockResolvedValue(null);
    const useCase = makeUseCase();

    await expect(useCase.execute(baseParams)).rejects.toThrow(
      'Client not found'
    );
    expect(mockException.notFound).toHaveBeenCalledWith('Client not found');
  });

  it('should return transaction on success', async () => {
    const fakeTransaction = {
      ...baseParams,
      id: 'uuid',
      before: BankMoney.create('0'),
      after: BankMoney.create('100.00'),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    mockClientRepository.getBy.mockResolvedValue({ id: baseParams.client_id });
    mockTransactionRepository.create.mockResolvedValue(fakeTransaction);

    const useCase = makeUseCase();

    const result = await useCase.execute(baseParams);

    expect(result).toEqual(fakeTransaction);
    expect(mockLogger.info).toHaveBeenCalledWith(
      'CreateTransactionUseCase.execute',
      `Client uuid made a DEPOSIT of R$ 100.00`
    );
  });

  it('should translate "Insufficient funds" error to badRequest', async () => {
    mockClientRepository.getBy.mockResolvedValue({ id: baseParams.client_id });
    mockTransactionRepository.create.mockRejectedValue(
      new Error('Insufficient funds')
    );

    const useCase = makeUseCase();

    await expect(useCase.execute(baseParams)).rejects.toThrow(
      'Insufficient funds'
    );
    expect(mockException.badRequest).toHaveBeenCalledWith('Insufficient funds');
  });

  it('should rethrow unknown errors', async () => {
    const unknownError = new Error('DB timeout');

    mockClientRepository.getBy.mockResolvedValue({ id: baseParams.client_id });
    mockTransactionRepository.create.mockRejectedValue(unknownError);

    const useCase = makeUseCase();

    await expect(useCase.execute(baseParams)).rejects.toThrow('DB timeout');
    expect(mockException.badRequest).not.toHaveBeenCalled();
  });
});
