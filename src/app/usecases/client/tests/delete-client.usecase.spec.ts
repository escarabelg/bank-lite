import { DeleteClientUseCase } from '../delete-client.usecase';
import { ClientEntity } from 'src/domain/entities/client.entity';

const mockClientRepository = {
  getBy: jest.fn(),
  deleteById: jest.fn()
};

const mockException = {
  notFound: jest.fn((message: string) => new Error(message))
};

const mockLogger = {
  info: jest.fn()
};

const makeUseCase = () =>
  new DeleteClientUseCase(
    mockClientRepository as any,
    mockException as any,
    mockLogger as any
  );

describe('app :: usecases :: client :: DeleteClientUseCase', () => {
  const clientId = 'c1991488-9988-4daa-b45d-7e859a64246a';
  const mockClient: ClientEntity = {
    id: clientId,
    name: 'User user',
    email: 'user@user.com',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw if client does not exist', async () => {
    mockClientRepository.getBy.mockResolvedValue(null);

    const useCase = makeUseCase();

    await expect(useCase.execute(clientId)).rejects.toThrow('Client not found');
    expect(mockException.notFound).toHaveBeenCalledWith('Client not found');
  });

  it('should delete client if exists', async () => {
    mockClientRepository.getBy.mockResolvedValue(mockClient);
    mockClientRepository.deleteById.mockResolvedValue(undefined);

    const useCase = makeUseCase();

    await expect(useCase.execute(clientId)).resolves.toBeUndefined();

    expect(mockClientRepository.getBy).toHaveBeenCalledWith({ id: clientId });
    expect(mockClientRepository.deleteById).toHaveBeenCalledWith(clientId);
    expect(mockLogger.info).toHaveBeenCalledWith(
      'DeleteClientUseCase.execute',
      `Client ${clientId} deleted successfully`
    );
  });
});
