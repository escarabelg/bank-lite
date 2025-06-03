import { ClientEntity } from 'src/domain/entities/client.entity';
import { CreateClientUseCase } from '../create-client.usecase';
import { TransactionTypeEnum } from 'src/domain/enums/transaction-type.enum';

const mockClientRepository = {
  getBy: jest.fn(),
  create: jest.fn()
};

const mockTransactionRepository = {
  create: jest.fn()
};

const mockException = {
  badRequest: jest.fn((message: string) => new Error(message))
};

const mockLogger = {
  info: jest.fn()
};

const makeUseCase = () =>
  new CreateClientUseCase(
    mockClientRepository as any,
    mockTransactionRepository as any,
    mockException as any,
    mockLogger as any
  );

describe('CreateClientUseCase', () => {
  const validParams = {
    name: 'User user',
    email: 'user@user.com'
  };

  const mockClient: ClientEntity = {
    id: 'c1991488-9988-4daa-b45d-7e859a64246a',
    name: 'User user',
    email: 'user@user.com',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw if client already exists', async () => {
    mockClientRepository.getBy.mockResolvedValue(mockClient);

    const useCase = makeUseCase();

    await expect(useCase.execute(validParams)).rejects.toThrow(
      'Client already exists'
    );
    expect(mockException.badRequest).toHaveBeenCalledWith(
      'Client already exists'
    );
  });

  it('should create and return client if not exists', async () => {
    mockClientRepository.getBy.mockResolvedValue(null);
    mockClientRepository.create.mockResolvedValue(mockClient);
    mockTransactionRepository.create.mockResolvedValue({});

    const useCase = makeUseCase();

    const result = await useCase.execute(validParams);

    expect(result).toEqual(mockClient);
    expect(mockClientRepository.create).toHaveBeenCalledWith(validParams);
    expect(mockTransactionRepository.create).toHaveBeenCalledWith({
      client_id: mockClient.id,
      type: TransactionTypeEnum.INIT,
      value: 0
    });
    expect(mockLogger.info).toHaveBeenCalledWith(
      'CreateClientUseCase.execute',
      `Client ${validParams.email} created successfully`
    );
  });
});
