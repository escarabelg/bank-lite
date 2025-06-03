import { ClientEntity } from 'src/domain/entities/client.entity';
import { ClientUpdateParams } from '../../repositories/client.repository.interface';

export interface IUpdateClientUseCase {
  execute(params: ClientUpdateParams): Promise<ClientEntity>;
}
