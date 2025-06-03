import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common';
import { IExceptionService } from 'src/domain/interfaces/exception/exception.interface';

export class ExceptionService implements IExceptionService {
  public badRequest(message: string): Error {
    return new BadRequestException(message);
  }

  public internalServerError(message?: string): Error {
    return new InternalServerErrorException(message);
  }

  public notFound(message: string): Error {
    return new NotFoundException(message);
  }
}
