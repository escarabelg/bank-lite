import { ClientEntity } from 'src/domain/entities/client.entity';
import { IExceptionService } from 'src/domain/interfaces/exception/exception.interface';
import { IClientRepository } from 'src/domain/interfaces/repositories/client.repository.interface';
import { IGetClientUseCase } from 'src/domain/interfaces/usecases/client/get-client.usecase.interface';

export class GetClientUseCase implements IGetClientUseCase {
  constructor(
    private readonly clientRepository: IClientRepository,
    private readonly exception: IExceptionService
  ) {}

  async execute(id: ClientEntity['id']): Promise<ClientEntity> {
    const existsClient = await this.clientRepository.getBy({ id });

    if (!existsClient) {
      throw this.exception.notFound('Client not found');
    }

    return existsClient;
  }
}
