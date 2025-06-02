import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common';
import { ExceptionService } from '../exception.infra';

describe('infra :: ExceptionService', () => {
  let service: ExceptionService;

  beforeEach(() => {
    service = new ExceptionService();
  });

  describe('badRequest', () => {
    it('should return a BadRequestException with correct message', () => {
      const error = service.badRequest('Invalid input');
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.message).toBe('Invalid input');
    });
  });

  describe('internalServerError', () => {
    it('should return an InternalServerErrorException with custom message', () => {
      const error = service.internalServerError('Unexpected error');
      expect(error).toBeInstanceOf(InternalServerErrorException);
      expect(error.message).toBe('Unexpected error');
    });

    it('should return an InternalServerErrorException with default message if none provided', () => {
      const error = service.internalServerError();
      expect(error).toBeInstanceOf(InternalServerErrorException);
      expect(error.message).toBe('Internal Server Error');
    });
  });

  describe('notFound', () => {
    it('should return a NotFoundException with correct message', () => {
      const error = service.notFound('Resource not found');
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toBe('Resource not found');
    });
  });
});
