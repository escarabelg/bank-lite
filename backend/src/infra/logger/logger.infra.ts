import { Logger } from '@nestjs/common';
import { ILoggerService } from 'src/domain/interfaces/logger/logger.interface';

export class LoggerService implements ILoggerService {
  info(context: string, message: string) {
    Logger.log(`[INFO] ${message}`, context);
  }
  error(context: string, message: string, trace?: string) {
    Logger.error(`[ERROR] ${message}`, trace, context);
  }
}
