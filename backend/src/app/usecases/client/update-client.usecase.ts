import { ClientEntity } from 'src/domain/entities/client.entity';
import { IExceptionService } from 'src/domain/interfaces/exception/exception.interface';
import { ILoggerService } from 'src/domain/interfaces/logger/logger.interface';
import {
  ClientUpdateParams,
  IClientRepository
} from 'src/domain/interfaces/repositories/client.repository.interface';
import { IUpdateClientUseCase } from 'src/domain/interfaces/usecases/client/update-client.usecase.interface';

export class UpdateClientUseCase implements IUpdateClientUseCase {
  constructor(
    private readonly clientRepository: IClientRepository,
    private readonly exception: IExceptionService,
    private readonly logger: ILoggerService
  ) {}

  async execute(params: ClientUpdateParams): Promise<ClientEntity> {
    const existsClient = await this.clientRepository.getBy({
      id: params.where.id
    });

    if (!existsClient) {
      throw this.exception.notFound('Client not found');
    }

    const client = await this.clientRepository.update(params);

    this.logger.info(
      'UpdateClientUseCase.execute',
      `Client ${client.name} has been updated`
    );

    return client;
  }
}
