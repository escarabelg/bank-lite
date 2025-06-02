import { ClientEntity } from 'src/domain/entities/client.entity';
import { ILoggerService } from 'src/domain/interfaces/logger/logger.interface';
import { LoggerService } from '../logger/logger.infra';
import { PrismaService } from '../database/prisma/prisma.service.client';
import { DatabaseError } from '../database/enum/database-error.enum';
import {
  ClientCreateParams,
  ClientGetByParams,
  ClientUpdateParams,
  IClientRepository
} from 'src/domain/interfaces/repositories/client.repository.interface';

export class ClientRepository implements IClientRepository {
  private readonly logger: ILoggerService;
  constructor(private readonly prismaService: PrismaService) {
    this.logger = new LoggerService();
  }

  public async create(params: ClientCreateParams): Promise<ClientEntity> {
    try {
      const createdClient = await this.prismaService.client.create({
        data: params
      });
      return this.toEntity(createdClient);
    } catch (error) {
      this.logger.error(`Error creating client: ${error.message}`);
      if (error?.code === DatabaseError.UniqueConstraintViolation) {
        throw new Error(
          'The provided email address is not allowed. Please use a different one'
        );
      }
      throw new Error('Error creating client, please try again later');
    }
  }

  public async find(params: Partial<ClientEntity>): Promise<ClientEntity[]> {
    try {
      const where = {} as any;
      if (params.id) where.id = params.id;
      if (params.name)
        where.name = { contains: params.name, mode: 'insensitive' };
      if (params.email) where.email = params.email;
      if (params.is_active) where.is_active = params.is_active;

      const clients = await this.prismaService.client.findMany({
        where,
        orderBy: { created_at: 'desc' },
        take: 1000
      });

      return clients.length ? clients.map(this.toEntity) : [];
    } catch (error) {
      this.logger.error(`Error fetching client list: ${error.message}`);
      throw new Error('Error fetching client list');
    }
  }

  public async getBy(params: ClientGetByParams): Promise<ClientEntity | null> {
    try {
      const client = await this.prismaService.client.findUnique({
        where: {
          id: params?.id,
          email: params?.email
        }
      });
      return client ? this.toEntity(client) : null;
    } catch (error) {
      this.logger.error(
        `Error getting client by ${JSON.stringify(params)}: ${error.message}`,
        error.stack
      );
      throw new Error('Error getting client');
    }
  }

  public async update(params: ClientUpdateParams): Promise<ClientEntity> {
    try {
      const updatedClient = await this.prismaService.client.update({
        where: {
          id: params.where.id
        },
        data: params.data
      });

      return this.toEntity(updatedClient);
    } catch (error) {
      this.logger.error(
        `Error to update client with id ${params.where.id}: ${error.message}`,
        error.stack
      );
      if (error?.code === DatabaseError.RecordNotFound) {
        // In educational settings, it's best to log errors privately rather than
        // reveal technical details to the user, which may expose vulnerabilities
        throw new Error(`Error updating client, not found`);
      }
      if (error?.code === DatabaseError.UniqueConstraintViolation) {
        // In educational settings, it's best to log errors privately rather than
        // reveal technical details to the user, which may expose vulnerabilities
        throw new Error(
          'The provided email address is not allowed. Please use a different one'
        );
      }
      throw new Error('Error updating client, please try again later');
    }
  }

  public async deleteById(id: ClientEntity['id']): Promise<void> {
    try {
      await this.prismaService.client.delete({
        where: { id }
      });
    } catch (error) {
      this.logger.error(
        `Failed to delete client with ID ${id}: ${error.message}`,
        error.stack
      );
      if (error?.code === DatabaseError.RecordNotFound) {
        throw new Error('Error deleting client, not found');
      }
      throw new Error('Error deleting client, please try again later');
    }
  }

  public async closeById(id: ClientEntity['id']): Promise<void> {
    try {
      await this.prismaService.client.update({
        where: { id },
        data: { is_active: false }
      });
    } catch (error) {
      this.logger.error(
        `Error deactivating client with id ${id}: ${error.message}`,
        error.stack
      );
      if (error?.code === DatabaseError.RecordNotFound) {
        throw new Error('Error deactivating client, not found');
      }
      throw new Error('Error deactivating client, please try again later');
    }
  }

  private toEntity(
    client: {
      name: string;
      email: string;
      id: string;
      is_active: boolean;
      created_at: Date;
      updated_at: Date;
    } | null
  ): ClientEntity | null {
    if (!client) {
      return null;
    }

    return {
      id: client.id,
      name: client.name,
      email: client.email,
      is_active: client.is_active,
      created_at: client.created_at.toISOString(),
      updated_at: client.updated_at.toISOString()
    } as ClientEntity;
  }
}
