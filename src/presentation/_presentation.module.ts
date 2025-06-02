import { Module } from '@nestjs/common';
import { InfraModule } from 'src/infra/_infra.module';
import { ExceptionService } from 'src/infra/exception/exception.infra';
import { LoggerService } from 'src/infra/logger/logger.infra';
import { ClientRepository } from 'src/infra/repositories/client.repository';
import { TransactionRepository } from 'src/infra/repositories/transaction.repository';
import { ClientController } from './http/controllers/client.controller';
import { TransactionController } from './http/controllers/transaction.controller';
import { GetClientUseCase } from 'src/app/usecases/client/get-client.usecase';
import { UpdateClientUseCase } from 'src/app/usecases/client/update-client.usecase';
import { CreateTransactionUseCase } from 'src/app/usecases/transaction/create-transaction.usecase';
import { ListTransactionUseCase } from 'src/app/usecases/transaction/list-transaction.usecase';
import { ListClientUseCase } from 'src/app/usecases/client/list-client.usecase';
import { CreateClientUseCase } from 'src/app/usecases/client/create-client.usecase';
import { DeleteClientUseCase } from 'src/app/usecases/client/delete-client.usecase';

@Module({
  imports: [InfraModule],
  controllers: [ClientController, TransactionController],
  providers: [
    {
      inject: [ClientRepository, ExceptionService, LoggerService],
      provide: 'CreateClientUseCase',
      useFactory: (
        clientRepository: ClientRepository,
        exception: ExceptionService,
        logger: LoggerService
      ) => new CreateClientUseCase(clientRepository, exception, logger)
    },
    {
      inject: [ClientRepository, ExceptionService, LoggerService],
      provide: 'DeleteClientUseCase',
      useFactory: (
        clientRepository: ClientRepository,
        exception: ExceptionService,
        logger: LoggerService
      ) => new DeleteClientUseCase(clientRepository, exception, logger)
    },
    {
      inject: [ClientRepository, ExceptionService],
      provide: 'GetClientUseCase',
      useFactory: (
        clientRepository: ClientRepository,
        exception: ExceptionService
      ) => new GetClientUseCase(clientRepository, exception)
    },
    {
      inject: [ClientRepository, ExceptionService, LoggerService],
      provide: 'UpdateClientUseCase',
      useFactory: (
        clientRepository: ClientRepository,
        exception: ExceptionService,
        logger: LoggerService
      ) => new UpdateClientUseCase(clientRepository, exception, logger)
    },
    {
      inject: [ClientRepository],
      provide: 'ListClientUseCase',
      useFactory: (clientRepository: ClientRepository) =>
        new ListClientUseCase(clientRepository)
    },
    {
      inject: [
        ClientRepository,
        TransactionRepository,
        ExceptionService,
        LoggerService
      ],
      provide: 'CreateTransactionUseCase',
      useFactory: (
        clientRepository: ClientRepository,
        transactionRepository: TransactionRepository,
        exception: ExceptionService,
        logger: LoggerService
      ) =>
        new CreateTransactionUseCase(
          clientRepository,
          transactionRepository,
          exception,
          logger
        )
    },
    {
      inject: [ClientRepository, TransactionRepository, ExceptionService],
      provide: 'ListTransactionUseCase',
      useFactory: (
        clientRepository: ClientRepository,
        transactionRepository: TransactionRepository,
        exception: ExceptionService
      ) =>
        new ListTransactionUseCase(
          clientRepository,
          transactionRepository,
          exception
        )
    }
  ]
})
export class PresentationModule {}
