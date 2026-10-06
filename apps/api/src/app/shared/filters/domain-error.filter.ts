import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Logger } from '@nestjs/common';
import { Response } from 'express';
import { DomainError } from '../errors/domain.error';

@Catch(DomainError)
export class DomainErrorFilter implements ExceptionFilter {
  private readonly logger = new Logger(DomainErrorFilter.name);

  catch(exception: DomainError, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.BAD_REQUEST;

    switch (exception.kind) {
      case 'VALIDATION_ERROR':
        status = HttpStatus.UNPROCESSABLE_ENTITY;
        break;
      case 'NOT_FOUND':
        status = HttpStatus.NOT_FOUND;
        break;
      case 'CONFLICT':
        status = HttpStatus.CONFLICT;
        break;
      default:
        status = HttpStatus.BAD_REQUEST;
    }

    this.logger.warn(`DomainError [${exception.code}]: ${exception.message}`);

    response.status(status).json({
      statusCode: status,
      error: exception.kind,
      code: exception.code,
      message: exception.message,
    });
  }
}
