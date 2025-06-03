import { Module } from '@nestjs/common';
import { ClientRepository } from './client.repository';
import { TransactionRepository } from './transaction.repository';
import { PrismaService } from '../database/prisma/prisma.service.client';

@Module({
  imports: [],
  providers: [
    PrismaService,
    {
      inject: [PrismaService],
      provide: ClientRepository,
      useFactory: (prismaClient: PrismaService) =>
        new ClientRepository(prismaClient)
    },
    {
      inject: [PrismaService],
      provide: TransactionRepository,
      useFactory: (prismaClient: PrismaService) =>
        new TransactionRepository(prismaClient)
    }
  ],
  exports: [ClientRepository, TransactionRepository]
})
export class RepositoriesModule {}
