export interface ILoggerService {
  info(context: string, message: string): void;
  error(context: string, message?: string, trace?: string): void;
}
