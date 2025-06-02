import { ClientEntity } from 'src/domain/entities/client.entity';

export type CreateClientUseCaseParams = Pick<ClientEntity, 'name' | 'email'>;

export interface ICreateClientUseCase {
  execute(params: CreateClientUseCaseParams): Promise<ClientEntity>;
}
