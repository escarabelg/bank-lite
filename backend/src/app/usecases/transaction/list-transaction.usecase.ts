import { ClientEntity } from 'src/domain/entities/client.entity';
import { TransactionEntity } from 'src/domain/entities/transaction.entity';
import { IExceptionService } from 'src/domain/interfaces/exception/exception.interface';
import { IClientRepository } from 'src/domain/interfaces/repositories/client.repository.interface';
import { ITransactionRepository } from 'src/domain/interfaces/repositories/transaction.repository.interface';
import { IListTransactionUseCase } from 'src/domain/interfaces/usecases/transaction/list-transaction.usecase';

export class ListTransactionUseCase implements IListTransactionUseCase {
  constructor(
    private readonly clientRepository: IClientRepository,
    private readonly transactionRepository: ITransactionRepository,
    private readonly exception: IExceptionService
  ) {}

  async execute(client_id: ClientEntity['id']): Promise<TransactionEntity[]> {
    const existsClient = await this.clientRepository.getBy({
      id: client_id
    });

    if (!existsClient) {
      throw this.exception.notFound('Client not found');
    }

    const transactions = await this.transactionRepository.findByUser(
      existsClient.id
    );

    return transactions;
  }
}
