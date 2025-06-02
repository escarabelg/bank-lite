import { Logger } from '@nestjs/common';
import { LoggerService } from '../logger.infra';

describe('infra :: LoggerService', () => {
  let service: LoggerService;

  beforeEach(() => {
    service = new LoggerService();
  });

  describe('info', () => {
    it('should call Logger.log with the correct parameters', () => {
      const logSpy = jest.spyOn(Logger, 'log').mockImplementation();

      service.info('MyContext', 'This is an info message');

      expect(logSpy).toHaveBeenCalledWith(
        '[INFO] This is an info message',
        'MyContext'
      );
    });
  });

  describe('error', () => {
    it('should call Logger.error with the correct parameters (with trace)', () => {
      const errorSpy = jest.spyOn(Logger, 'error').mockImplementation();

      service.error('MyContext', 'Something went wrong', 'stack trace');

      expect(errorSpy).toHaveBeenCalledWith(
        '[ERROR] Something went wrong',
        'stack trace',
        'MyContext'
      );
    });

    it('should call Logger.error with undefined trace when not provided', () => {
      const errorSpy = jest.spyOn(Logger, 'error').mockImplementation();

      service.error('MyContext', 'Something went wrong');

      expect(errorSpy).toHaveBeenCalledWith(
        '[ERROR] Something went wrong',
        undefined,
        'MyContext'
      );
    });
  });
});
