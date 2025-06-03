import { ClientEntity } from 'src/domain/entities/client.entity';

export interface IDeleteClientUseCase {
  execute(id: ClientEntity['id']): Promise<void>;
}
