import { ClientEntity } from 'src/domain/entities/client.entity';

export interface IListClientUseCase {
  execute(): Promise<ClientEntity[]>;
}
