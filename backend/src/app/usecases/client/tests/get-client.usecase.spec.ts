import { GetClientUseCase } from '../get-client.usecase';
import { ClientEntity } from 'src/domain/entities/client.entity';

const mockClientRepository = {
  getBy: jest.fn()
};

const mockException = {
  notFound: jest.fn((message: string) => new Error(message))
};

const makeUseCase = () =>
  new GetClientUseCase(mockClientRepository as any, mockException as any);

describe('app :: usecases :: client :: GetClientUseCase', () => {
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
    expect(mockClientRepository.getBy).toHaveBeenCalledWith({ id: clientId });
  });

  it('should return the client if found', async () => {
    mockClientRepository.getBy.mockResolvedValue(mockClient);

    const useCase = makeUseCase();

    const result = await useCase.execute(clientId);

    expect(result).toEqual(mockClient);
    expect(mockClientRepository.getBy).toHaveBeenCalledWith({ id: clientId });
  });
});
