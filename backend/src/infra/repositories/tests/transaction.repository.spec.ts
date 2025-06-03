import { TransactionTypeEnum } from 'src/domain/enums/transaction-type.enum';
import { LoggerService } from 'src/infra/logger/logger.infra';
import { TransactionRepository } from '../transaction.repository';
import { BankMoney } from 'src/infra/bank-money/bank-money.infra';

const mockPrismaService = {
  $transaction: jest.fn(),
  transaction: {
    findMany: jest.fn()
  }
};

const logger = new LoggerService();
jest.spyOn(logger, 'error').mockImplementation(() => {});
jest.spyOn(logger, 'info').mockImplementation(() => {});

describe('infra :: repositories :: TransactionRepository', () => {
  let repository: TransactionRepository;

  beforeEach(() => {
    repository = new TransactionRepository(mockPrismaService as any);
    (repository as any).logger = logger;
  });

  describe('create', () => {
    it('should create a transaction (deposit)', async () => {
      const mockTx = {
        transaction: {
          findFirst: jest.fn().mockResolvedValue(null),
          create: jest.fn().mockResolvedValue({
            client_id: 'uuid',
            type: TransactionTypeEnum.DEPOSIT,
            value: BankMoney.create('100').fixed(2),
            before: BankMoney.create('0'),
            after: BankMoney.create('100').fixed(2),
            id: 'uuid',
            created_at: new Date(),
            updated_at: new Date()
          })
        }
      };

      mockPrismaService.$transaction.mockImplementation(async (cb) =>
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        cb(mockTx)
      );

      const result = await repository.create({
        client_id: 'uuid',
        type: TransactionTypeEnum.DEPOSIT,
        value: '100.00',
        description: 'Initial deposit'
      });

      expect(result).toHaveProperty('id');
      expect(result.value.toString()).toBe('100');
      expect(result.before.toString()).toBe('0');
      expect(result.after.toString()).toBe('100');
    });

    it('should reject withdrawal with insufficient funds', async () => {
      const mockTx = {
        transaction: {
          findFirst: jest.fn().mockResolvedValue(null) // saldo anterior 0
        }
      };

      mockPrismaService.$transaction.mockImplementation(async (cb) =>
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        cb(mockTx)
      );

      await expect(
        repository.create({
          client_id: 'uuid',
          type: TransactionTypeEnum.WITHDRAWAL,
          value: '50.00'
        })
      ).rejects.toThrow('Insufficient funds');
    });

    it('should handle internal errors', async () => {
      mockPrismaService.$transaction.mockRejectedValue(new Error('DB error'));

      await expect(
        repository.create({
          client_id: 'uuid',
          type: TransactionTypeEnum.DEPOSIT,
          value: '50.00'
        })
      ).rejects.toThrow(/please try again later/);
    });
  });

  describe('findByUser', () => {
    it('should return a list of transactions', async () => {
      const now = new Date();
      mockPrismaService.transaction.findMany.mockResolvedValue([
        {
          client_id: 'uuid',
          type: TransactionTypeEnum.DEPOSIT,
          value: BankMoney.create('100'),
          before: BankMoney.create('0'),
          after: BankMoney.create('100'),
          description: 'test',
          id: 'tx1',
          created_at: now,
          updated_at: now
        }
      ]);

      const result = await repository.findByUser('123');

      expect(result.length).toBe(1);
      expect(result[0].client_id).toBe('uuid');
      expect(result[0].value.toString()).toBe('100');
    });

    it('should return empty array when no transactions', async () => {
      mockPrismaService.transaction.findMany.mockResolvedValue([]);

      const result = await repository.findByUser('123');

      expect(result).toEqual([]);
    });

    it('should handle error while fetching transactions', async () => {
      mockPrismaService.transaction.findMany.mockRejectedValue(
        new Error('Connection failed')
      );

      await expect(repository.findByUser('123')).rejects.toThrow(
        /Error fetching client transactions/
      );
    });
  });
});
