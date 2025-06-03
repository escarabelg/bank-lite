import { TransactionEntity } from 'src/domain/entities/transaction.entity';
import { IExceptionService } from 'src/domain/interfaces/exception/exception.interface';
import { ILoggerService } from 'src/domain/interfaces/logger/logger.interface';
import { IClientRepository } from 'src/domain/interfaces/repositories/client.repository.interface';
import { ITransactionRepository } from 'src/domain/interfaces/repositories/transaction.repository.interface';
import {
  CreateTransactionUseCaseParams,
  ICreateTransactionUseCase
} from 'src/domain/interfaces/usecases/transaction/create-transaction.usecase.interface';
import { BankMoney } from 'src/infra/bank-money/bank-money.infra';

export class CreateTransactionUseCase implements ICreateTransactionUseCase {
  constructor(
    private readonly clientRepository: IClientRepository,
    private readonly transactionRepository: ITransactionRepository,
    private readonly exception: IExceptionService,
    private readonly logger: ILoggerService
  ) {}

  async execute(
    params: CreateTransactionUseCaseParams
  ): Promise<TransactionEntity> {
    if (BankMoney.create(params.value).lte(0)) {
      throw this.exception.badRequest(
        'Insufficient value for valid transaction'
      );
    }

    const existsClient = await this.clientRepository.getBy({
      id: params.client_id
    });

    if (!existsClient) {
      throw this.exception.notFound('Client not found');
    }

    try {
      const transaction = await this.transactionRepository.create(params);

      this.logger.info(
        'CreateTransactionUseCase.execute',
        `Client ${existsClient.id} made a ${params.type.valueOf()} of R$ ${transaction.value.toString()}`
      );

      return transaction;
    } catch (error) {
      if ((error as Error).message === 'Insufficient funds') {
        throw this.exception.badRequest('Insufficient funds');
      }

      throw error;
    }
  }
}
