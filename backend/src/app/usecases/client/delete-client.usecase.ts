import { ClientEntity } from 'src/domain/entities/client.entity';
import { IExceptionService } from 'src/domain/interfaces/exception/exception.interface';
import { ILoggerService } from 'src/domain/interfaces/logger/logger.interface';
import { IClientRepository } from 'src/domain/interfaces/repositories/client.repository.interface';
import { IDeleteClientUseCase } from 'src/domain/interfaces/usecases/client/delete-client.usecase.interface';

export class DeleteClientUseCase implements IDeleteClientUseCase {
  constructor(
    private readonly clientRepository: IClientRepository,
    private readonly exception: IExceptionService,
    private readonly logger: ILoggerService
  ) {}

  async execute(id: ClientEntity['id']): Promise<void> {
    const existsClient = await this.clientRepository.getBy({ id });

    if (!existsClient) {
      throw this.exception.notFound('Client not found');
    }

    await this.clientRepository.deleteById(existsClient.id);

    this.logger.info(
      'DeleteClientUseCase.execute',
      `Client ${id} deleted successfully`
    );
  }
}
