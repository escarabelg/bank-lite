import { UpdateClientUseCase } from '../update-client.usecase';
import { ClientEntity } from 'src/domain/entities/client.entity';
import { ClientUpdateParams } from 'src/domain/interfaces/repositories/client.repository.interface';

describe('app :: usecases :: client :: UpdateClientUseCase', () => {
  const mockClient: ClientEntity = {
    id: 'c1991488-9988-4daa-b45d-7e859a64246a',
    name: 'User user',
    email: 'user@user.com',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const updatedClient: ClientEntity = {
    ...mockClient,
    name: 'Updated Name',
    updated_at: new Date().toISOString()
  };

  const mockRepository = {
    getBy: jest.fn(),
    update: jest.fn()
  };

  const mockLogger = {
    info: jest.fn()
  };

  const mockException = {
    notFound: jest.fn((msg) => new Error(msg))
  };

  const makeUseCase = () =>
    new UpdateClientUseCase(
      mockRepository as any,
      mockException as any,
      mockLogger as any
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should update an existing client', async () => {
    mockRepository.getBy.mockResolvedValue(mockClient);
    mockRepository.update.mockResolvedValue(updatedClient);

    const useCase = makeUseCase();

    const params: ClientUpdateParams = {
      where: { id: mockClient.id },
      data: { name: 'Updated Name' }
    };

    const result = await useCase.execute(params);

    expect(result).toEqual(updatedClient);
    expect(mockRepository.getBy).toHaveBeenCalledWith({ id: mockClient.id });
    expect(mockRepository.update).toHaveBeenCalledWith(params);
    expect(mockLogger.info).toHaveBeenCalledWith(
      'UpdateClientUseCase.execute',
      `Client ${updatedClient.name} has been updated`
    );
  });

  it('should throw notFound error if client does not exist', async () => {
    mockRepository.getBy.mockResolvedValue(null);

    const useCase = makeUseCase();

    const params: ClientUpdateParams = {
      where: { id: 'nonexistent-id' },
      data: { name: 'Updated Name' }
    };

    await expect(useCase.execute(params)).rejects.toThrow('Client not found');
    expect(mockRepository.getBy).toHaveBeenCalledWith({ id: 'nonexistent-id' });
    expect(mockRepository.update).not.toHaveBeenCalled();
  });
});
