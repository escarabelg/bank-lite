import { ClientEntity } from 'src/domain/entities/client.entity';
import { TransactionEntity } from 'src/domain/entities/transaction.entity';

export interface IListTransactionUseCase {
  execute(client_id: ClientEntity['id']): Promise<TransactionEntity[]>;
}
