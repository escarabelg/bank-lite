export interface IExceptionService {
  badRequest(message: string): Error;
  internalServerError(message?: string): Error;
  notFound(message: string): Error;
}
