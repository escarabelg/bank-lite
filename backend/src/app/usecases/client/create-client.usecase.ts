import { ClientEntity } from 'src/domain/entities/client.entity';
import { TransactionTypeEnum } from 'src/domain/enums/transaction-type.enum';
import { IExceptionService } from 'src/domain/interfaces/exception/exception.interface';
import { ILoggerService } from 'src/domain/interfaces/logger/logger.interface';
import { IClientRepository } from 'src/domain/interfaces/repositories/client.repository.interface';
import { ITransactionRepository } from 'src/domain/interfaces/repositories/transaction.repository.interface';
import {
  CreateClientUseCaseParams,
  ICreateClientUseCase
} from 'src/domain/interfaces/usecases/client/create-client.usecase.interface';

export class CreateClientUseCase implements ICreateClientUseCase {
  constructor(
    private readonly clientRepository: IClientRepository,
    private readonly transactionRepository: ITransactionRepository,
    private readonly exception: IExceptionService,
    private readonly logger: ILoggerService
  ) {}

  async execute(params: CreateClientUseCaseParams): Promise<ClientEntity> {
    const alreadyExists = await this.clientRepository.getBy({
      email: params.email
    });

    if (alreadyExists) {
      throw this.exception.badRequest('Client already exists');
    }

    const client = await this.clientRepository.create(params);
    void this.transactionRepository.create({
      client_id: client.id,
      type: TransactionTypeEnum.INIT,
      value: 0
    });

    this.logger.info(
      'CreateClientUseCase.execute',
      `Client ${params.email} created successfully`
    );

    return client;
  }
}
