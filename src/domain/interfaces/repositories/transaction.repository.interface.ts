import { TransactionEntity } from 'src/domain/entities/transaction.entity';
import { ClientEntity } from 'src/domain/entities/client.entity';

export type TransactionCreateParams = Pick<
  TransactionEntity,
  'client_id' | 'type' | 'value' | 'description'
>;

export interface ITransactionRepository {
  create(params: TransactionCreateParams): Promise<TransactionEntity>;
  findByUser(id: ClientEntity['id']): Promise<TransactionEntity[]>;
}
