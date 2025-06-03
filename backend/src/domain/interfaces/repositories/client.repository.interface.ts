import { ClientEntity } from '../../entities/client.entity';

export type ClientCreateParams = Pick<ClientEntity, 'name' | 'email'>;
export type ClientGetByParams = Partial<Pick<ClientEntity, 'id' | 'email'>>;

export type ClientUpdateParams = {
  where: Pick<ClientEntity, 'id'>;
  data: Pick<ClientEntity, 'name'>;
};

export interface IClientRepository {
  create(params: ClientCreateParams): Promise<ClientEntity>;
  find(params: Partial<ClientEntity>): Promise<ClientEntity[]>;
  getBy(params: ClientGetByParams): Promise<ClientEntity | null>;
  update(params: ClientUpdateParams): Promise<ClientEntity>;
  deleteById(id: ClientEntity['id']): Promise<void>;
  closeById(id: ClientEntity['id']): Promise<void>;
}
