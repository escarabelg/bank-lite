import { Module } from '@nestjs/common';
import { ExceptionService } from './exception/exception.infra';
import { LoggerService } from './logger/logger.infra';
import { RepositoriesModule } from './repositories/_repositories.module';

@Module({
  imports: [RepositoriesModule],
  providers: [ExceptionService, LoggerService],
  exports: [RepositoriesModule, ExceptionService, LoggerService]
})
export class InfraModule {}
