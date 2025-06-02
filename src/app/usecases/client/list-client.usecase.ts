import { ClientEntity } from 'src/domain/entities/client.entity';
import { IClientRepository } from 'src/domain/interfaces/repositories/client.repository.interface';
import { IListClientUseCase } from 'src/domain/interfaces/usecases/client/list-client.usecase.interface';

export class ListClientUseCase implements IListClientUseCase {
  constructor(private readonly clientRepository: IClientRepository) {}

  async execute(): Promise<ClientEntity[]> {
    const clients = await this.clientRepository.find({});
    return clients;
  }
}
