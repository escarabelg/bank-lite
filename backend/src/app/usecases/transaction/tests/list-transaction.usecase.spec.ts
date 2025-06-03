import { TransactionEntity } from 'src/domain/entities/transaction.entity';
import { TransactionTypeEnum } from 'src/domain/enums/transaction-type.enum';
import { ListTransactionUseCase } from '../list-transaction.usecase';

// Mocks
const mockClientRepository = {
  getBy: jest.fn()
};

const mockTransactionRepository = {
  findByUser: jest.fn()
};

const mockException = {
  notFound: jest.fn((message: string) => new Error(message))
};

const makeUseCase = () =>
  new ListTransactionUseCase(
    mockClientRepository as any,
    mockTransactionRepository as any,
    mockException as any
  );

describe('app :: usecases :: transaction :: ListTransactionUseCase', () => {
  const clientId = 'client-001';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw if client does not exist', async () => {
    mockClientRepository.getBy.mockResolvedValue(null);

    const useCase = makeUseCase();

    await expect(useCase.execute(clientId)).rejects.toThrow('Client not found');
    expect(mockException.notFound).toHaveBeenCalledWith('Client not found');
  });

  it('should return transactions if client exists', async () => {
    const transactions: TransactionEntity[] = [
      {
        id: 'tx-1',
        client_id: clientId,
        type: TransactionTypeEnum.DEPOSIT,
        value: '100',
        before: '0',
        after: '100',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];

    mockClientRepository.getBy.mockResolvedValue({ id: clientId });
    mockTransactionRepository.findByUser.mockResolvedValue(transactions);

    const useCase = makeUseCase();

    const result = await useCase.execute(clientId);

    expect(result).toEqual(transactions);
    expect(mockTransactionRepository.findByUser).toHaveBeenCalledWith(clientId);
  });
});
