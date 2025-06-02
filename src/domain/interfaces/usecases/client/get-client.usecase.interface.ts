import { ClientEntity } from 'src/domain/entities/client.entity';

export interface IGetClientUseCase {
  execute(id: ClientEntity['id']): Promise<ClientEntity>;
}
