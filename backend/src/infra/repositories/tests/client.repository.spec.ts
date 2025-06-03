import { DatabaseError } from 'src/infra/database/enum/database-error.enum';
import { LoggerService } from 'src/infra/logger/logger.infra';
import { ClientRepository } from '../client.repository';

const mockPrismaService = {
  client: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  }
};

const logger = new LoggerService();
jest.spyOn(logger, 'error').mockImplementation(() => {});
jest.spyOn(logger, 'info').mockImplementation(() => {});

describe('infra :: repositories :: ClientRepository', () => {
  let repository: ClientRepository;

  beforeEach(() => {
    repository = new ClientRepository(mockPrismaService as any);
    (repository as any).logger = logger;
  });

  describe('create', () => {
    it('should create a client successfully', async () => {
      const clientData = { name: 'User user', email: 'user@user.com' };
      const created = {
        ...clientData,
        id: 'uuid',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      };
      mockPrismaService.client.create.mockResolvedValue(created);

      const result = await repository.create(clientData as any);

      expect(result).toMatchObject({
        id: created.id,
        name: created.name,
        email: created.email,
        is_active: true
      });
    });

    it('should handle unique constraint error', async () => {
      mockPrismaService.client.create.mockRejectedValue({
        code: DatabaseError.UniqueConstraintViolation,
        message: 'error'
      });

      await expect(repository.create({} as any)).rejects.toThrow(/not allowed/);
    });
  });

  describe('find', () => {
    it('should return a list of clients', async () => {
      const clients = [
        {
          id: 'uuid',
          name: 'User user',
          email: 'user@user.com',
          is_active: true,
          created_at: new Date(),
          updated_at: new Date()
        }
      ];
      mockPrismaService.client.findMany.mockResolvedValue(clients);

      const result = await repository.find({});

      expect(result.length).toBe(1);
      expect(result[0].name).toBe('User user');
    });
  });

  describe('getBy', () => {
    it('should return a client by ID', async () => {
      const client = {
        id: 'uuid',
        name: 'User user',
        email: 'user@user.com',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      };
      mockPrismaService.client.findUnique.mockResolvedValue(client);

      const result = await repository.getBy({ id: '1' });

      expect(result?.id).toBe('uuid');
    });

    it('should return null when not found', async () => {
      mockPrismaService.client.findUnique.mockResolvedValue(null);

      const result = await repository.getBy({ id: 'not-found' });

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a client successfully', async () => {
      const updated = {
        id: 'uuid',
        name: 'Jane',
        email: 'jane@example.com',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      };
      mockPrismaService.client.update.mockResolvedValue(updated);

      const result = await repository.update({
        where: { id: '1' },
        data: { name: 'Jane' }
      });

      expect(result.name).toBe('Jane');
    });
  });

  describe('deleteById', () => {
    it('should delete a client', async () => {
      mockPrismaService.client.delete.mockResolvedValue(undefined);

      await expect(repository.deleteById('1')).resolves.not.toThrow();
    });
  });

  describe('closeById', () => {
    it('should deactivate a client', async () => {
      mockPrismaService.client.update.mockResolvedValue(undefined);

      await expect(repository.closeById('1')).resolves.not.toThrow();
    });
  });
});
