import { ClientEntity } from 'src/domain/entities/client.entity';
import { ILoggerService } from 'src/domain/interfaces/logger/logger.interface';
import { LoggerService } from '../logger/logger.infra';
import { PrismaService } from '../database/prisma/prisma.service.client';
import {
  ITransactionRepository,
  TransactionCreateParams
} from 'src/domain/interfaces/repositories/transaction.repository.interface';
import { TransactionEntity } from 'src/domain/entities/transaction.entity';
import { Decimal } from '@prisma/client/runtime/library';
import { BankMoney } from '../bank-money/bank-money.infra';
import { TransactionTypeEnum } from 'src/domain/enums/transaction-type.enum';

export class TransactionRepository implements ITransactionRepository {
  private readonly logger: ILoggerService;
  constructor(private readonly prismaService: PrismaService) {
    this.logger = new LoggerService();
  }

  public async create(
    params: TransactionCreateParams
  ): Promise<TransactionEntity> {
    try {
      return await this.prismaService.$transaction(async (tx) => {
        const value = BankMoney.create(params.value);

        const lastTransaction = this.toEntity(
          await tx.transaction.findFirst({
            where: { client_id: params.client_id },
            orderBy: { created_at: 'desc' }
          })
        );

        const before = lastTransaction
          ? BankMoney.create(lastTransaction.after)
          : BankMoney.create('0');

        const after =
          params.type === TransactionTypeEnum.WITHDRAWAL
            ? before.sub(value)
            : before.add(value);

        if (after.lt(0)) {
          throw new Error('Insufficient funds');
        }

        const newTransaction = await tx.transaction.create({
          data: {
            client_id: params.client_id,
            type: params.type,
            value: value.fixed(2).toString(),
            before: before.fixed(2).toString(),
            after: after.fixed(2).toString(),
            description: params?.description
          }
        });

        return this.toEntity(newTransaction);
      });
    } catch (error) {
      this.logger.error(
        `Error creating transaction: ${error.message}`,
        error.stack
      );

      if ((error as Error).message === 'Insufficient funds') {
        throw error;
      }

      throw new Error('Error creating transaction, please try again later');
    }
  }

  public async findByUser(
    id: ClientEntity['id']
  ): Promise<TransactionEntity[]> {
    try {
      const transactions = await this.prismaService.transaction.findMany({
        where: {
          client_id: id
        },
        orderBy: { created_at: 'asc' },
        take: 1000
      });

      return transactions.length ? transactions.map(this.toEntity) : [];
    } catch (error) {
      this.logger.error(
        `Error fetching client transactions: ${error.message}`,
        error.stack
      );
      throw new Error('Error fetching client transactions');
    }
  }

  private toEntity(
    transaction: {
      client_id: string;
      type: string;
      value: Decimal;
      description: string | null;
      id: string;
      before: Decimal | null;
      after: Decimal | null;
      created_at: Date;
      updated_at: Date;
    } | null
  ): TransactionEntity | null {
    if (!transaction) {
      return null;
    }

    return {
      client_id: transaction.client_id,
      type: transaction.type,
      value: BankMoney.create(transaction.value.toString()),
      description: transaction?.description,
      id: transaction.id,
      before: BankMoney.create(transaction.before.toString()),
      after: BankMoney.create(transaction.after.toString()),
      created_at: transaction.created_at.toISOString(),
      updated_at: transaction.updated_at.toISOString()
    } as TransactionEntity;
  }
}
