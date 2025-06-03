import { ListClientUseCase } from '../list-client.usecase';
import { ClientEntity } from 'src/domain/entities/client.entity';

const mockClientRepository = {
  find: jest.fn()
};

const makeUseCase = () => new ListClientUseCase(mockClientRepository as any);

describe('app :: usecases :: client :: ListClientUseCase', () => {
  const mockClients: ClientEntity[] = [
    {
      id: 'c1991488-9988-4daa-b45d-7e859a64246a',
      name: 'User user',
      email: 'user@user.com',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'c1991488-9988-4daa-b45d-7e859a64246b',
      name: 'User user2',
      email: 'user2@user.com',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return a list of clients', async () => {
    mockClientRepository.find.mockResolvedValue(mockClients);

    const useCase = makeUseCase();

    const result = await useCase.execute();

    expect(result).toEqual(mockClients);
    expect(mockClientRepository.find).toHaveBeenCalledWith({});
  });

  it('should return an empty array if no clients exist', async () => {
    mockClientRepository.find.mockResolvedValue([]);

    const useCase = makeUseCase();

    const result = await useCase.execute();

    expect(result).toEqual([]);
    expect(mockClientRepository.find).toHaveBeenCalledWith({});
  });
});
