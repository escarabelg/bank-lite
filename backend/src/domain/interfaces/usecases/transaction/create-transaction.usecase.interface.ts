import { TransactionEntity } from 'src/domain/entities/transaction.entity';
import { TransactionCreateParams } from '../../repositories/transaction.repository.interface';

export type CreateTransactionUseCaseParams = TransactionCreateParams;

export interface ICreateTransactionUseCase {
  execute(params: CreateTransactionUseCaseParams): Promise<TransactionEntity>;
}
